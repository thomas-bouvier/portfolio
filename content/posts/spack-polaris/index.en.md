+++
title = "Getting Started with Spack on Polaris"
date = 2025-01-25
description = "In this article, I will go through setting up Spack on the Polaris supercomputer."
draft = false
+++

Spack is a powerful package manager designed for HPC. Although presenting a steep learning curve, Spack can significantly benefit workflows involving frequent builds with complex dependencies. To just name a few:

- In HPC, hardware specifics can significantly impact software performance. Spack addresses this by allowing for hardware-aware builds, unlike some package managers that aim for highly isolated build environments, which can overlook these performance-critical details. 

- Spack enables the construction of multiple versions and configurations of the same software. This is crucial in HPC environments where the officially supported versions provided by your Linux distribution doesn't meet your needs.

- HPC workflows often require the installation of numerous dependencies and libraries that are not typically included in standard system installations. Spack provides a structured approach to managing these dependencies (which I'll detail below), avoiding the pitfalls of ad-hoc solutions like custom bash scripts. Spack will make it possible to reuse the work already accomplished by numerous contributors.

- Spack allows for the easy customization of package builds. Hackability is important!

After this brief introduction to Spack, let's move on to the specifics of the Polaris supercomputer, on which we want to install optimized packages.
## Polaris Supercomputer

Polaris is hosted at the Argonne National Laboratory in Illinois. The system has a theoretical peak performance of 34 petaflops (44 petaflops of Tensor Core FP64 performance), ranking it #47 on the [top 500 list](https://www.top500.org/lists/top500/list/2024/11/) as of the writing of this blog post. The system is built from 560 nodes, each with the following metrics:

| Metric                                    | Value      |
| ----------------------------------------- | ---------- |
| Number of AMD EPYC Milan CPUs             | 1          |
| Number of NVIDIA A100 GPUs                | 4          |
| Total HBM2 Memory                         | 160 GB     |
| HBM2 Memory BW per GPU                    | 1.6 TB/s   |
| Total DDR4 Memory                         | 512 GB     |
| DDR4 Memory BW                            | 204.8 GB/s |
| Number of NVMe SSDs                       | 2          |
| Total NVMe SSD Capacity                   | 3.2 TB     |
| Number of Cassini-based Slingshot 11 NICs | 2          |
| PCIe Gen4 BW                              | 64 GB/s    |
| NVLink BW                                 | 600 GB/s   |
| Total GPU DP Tensor Core Flops            | 78 TF      |

The CPU-GPU communication is performed via PCIe Gen4, offering a bandwidth of 64 GB/s, while the GPUs themselves are interconnected using NVLink, providing a 600 GB/s bandwidth. Additionally, Polaris employs the HPE Slingshot 11 interconnect with a Dragonfly topology achieving a 200 Gb/s bandwidth.

{{< gallery "Polaris Single Node Configuration" >}}
    {{< image src="images/single_node.png" >}}
{{< /gallery >}}


The official usage guide for Polaris is available [here](https://docs.alcf.anl.gov/polaris/getting-started/
).

## What makes this machine special?

Polaris is a Cray machine, a subsidiary of Hewlett Packard Enterprise, wich requires some Cray special sauce to behave more sanely. The Cray Programming Environment (PE) uses three compiler wrappers for building software:

- `cc` - C compiler
- `CC` - C++ compiler
- `ftn` - Fortran compiler

Each of these wrappers can select a specific vendor compiler based on the `PrgEnv` module loaded in the environment. Module files are an easy way to modify the environment in a controlled manner during a shell session. They contain the information needed to run an application or use a library. The `module` command is used to interpret and execute module files, providing a convenient way to access system-provided packages and compilers.

The default PE on Polaris is currently `NVHPC`. The `GNU` compilers are available via another PE. The command `module swap PrgEnv-nvhpc PrgEnv-gnu` can be used to switch to the `GNU` PE (gcc, g++, gfortran). You should also run `module load nvhpc-mixed` to gain access to CUDA libraries that may be required for building executables.

```bash
module swap PrgEnv-nvhpc PrgEnv-gnu
module load nvhpc-mixed
```

These commands will be automated to be handled by Spack later in this article.

You can find more information on compiling and linking on Polaris in the [official overview](https://docs.alcf.anl.gov/polaris/compiling-and-linking/compiling-and-linking-overview/).

## Loading Spack

The escalating complexity of HPC libraries poses significant
challenges for users of HPC clusters. The intricate dependencies of scientific applications, which necessitate
specific versions of compilers, implementations of standards like MPI or platforms like CUDA, and other dependency libraries, make the adoption of a single, standardized
software stack impractical. Besides, the combinatorial size of the configuration space
makes it difficult to manage multiple configurations.

In response to these challenges,
Spack provides a recursive specification syntax to invoke parametric
builds of packages and dependencies. It allows any number of build outputs to coexist on the same machine
and ensures that installed packages can locate their dependencies regardless of the environment. Spack
leverages declarative package directives (_specs_) to express all the intersecting and disjoint
compatibilities that one version of a package has with another. Spack also leverages the concept of _variants_ which are declared in the package recipe, and along with versions can also be configured by
the end user via command-line parameters.

Having a quick look at the [excellent Spack documentation](https://spack-tutorial.readthedocs.io/en/latest/tutorial_basics.html) is recommended before proceeding. Alright, let's log into Polaris using:

```bash
ssh <username>@polaris.alcf.anl.gov
```

Clone Spack using the following command:

```bash
mkdir -p ~/git
git clone --depth=2 https://github.com/spack/spack ~/git/spack-polaris
```

Polaris shares a home filesystem with other machines, which might have different hardware and use different module systems. The following `use_polaris` function loads a copy of Spack specifically for Polaris and uses a separate Spack instance for other machines. We use Spack’s `SPACK_USER_CONFIG_PATH` variable to keep these cleanly separate. Lines related to setting proxies are required for nodes not having outbound network connectivity. Put the following in your `.bashrc` file:

```bash {filename=".bashrc"}
function use_polaris {
    if hostname -f | grep polaris &>/dev/null; then
        echo "Loading Spack for Polaris"
        source ${HOME}/git/spack-polaris/share/spack/setup-env.sh

        export HTTP_PROXY="http://proxy.alcf.anl.gov:3128"
        export HTTPS_PROXY="http://proxy.alcf.anl.gov:3128"
        export http_proxy="http://proxy.alcf.anl.gov:3128"
        export https_proxy="http://proxy.alcf.anl.gov:3128"
        export ftp_proxy="http://proxy.alcf.anl.gov:3128"

        export clustername=polaris
    fi
    
    export SPACK_USER_CONFIG_PATH="$HOME/.spack/$clustername"
    export SPACK_USER_CACHE_PATH="$SPACK_USER_CONFIG_PATH"
}
```

Once done, loading Spack with the relevant modules can then be conveniently achieved using command `use_polaris`.

Don't forget to tweak your [Spack configuration](https://spack.readthedocs.io/en/latest/configuration.html) to your needs using `spack config --scope defaults edit config`. In particular, I like setting `build_stage: /local/scratch/<username>/spack-stage` to leverage local scratch SSD storage on compute nodes for building packages.

##  Tailoring Spack for Polaris

We now want Spack to use the compilers present in the PE, as explained above. Simply create the file `compilers.yaml` at `/home/<username>/.spack/polaris/compilers.yaml` with the following content:

```yaml {filename="compilers.yaml"}
compilers:
  - compiler:
      spec: gcc@12.3
      paths:
        cc: cc
        cxx: CC
        f77: ftn
        fc: ftn
      flags: {}
      operating_system: sles15
      target: any
      modules:
      - PrgEnv-gnu
      - nvhpc-mixed
      - gcc-native/12.3
      - libfabric
      - cudatoolkit-standalone
      environment: {}
      extra_rpaths: []
```

Besides, Spack allows you to customize how your software is built through the `packages.yaml` file. Using it, you can make Spack prefer particular implementations of virtual dependencies (e.g., using cray-mpich as the MPI implementation), or you can make it prefer to build with particular compilers. You can also tell Spack to use _external_ software installations already present on your system to avoid configuring them. Please read the docs about [package settings](https://spack.readthedocs.io/en/latest/packages_yaml.html) for detailed instructions.

To reuse my package configuration tailored for Polaris, simply create `packages.yaml` at `/home/<username>/.spack/polaris/packages.yaml` with the following content:

```yaml {filename="packages.yaml"}
  packages:
    all:
      require:
      - "%gcc@12.3"
      - "target=zen3"
    mpi:
      require:
      - cray-mpich
    json-c:
      require:
      - "@0.13.0"
    pkgconfig:
      require:
      - pkg-config
    cray-mpich:
      buildable: false
      externals:
      - spec: cray-mpich@8.1.28
        modules:
        - cray-mpich/8.1.28
    mercury:
      buildable: true
      variants: ~boostsys ~checksum
    libfabric:
      buildable: false
      externals:
      - spec: libfabric@1.15.2.0
        modules:
        - libfabric/1.15.2.0
    autoconf:
      buildable: false
      externals:
      - spec: autoconf@2.69
        prefix: /usr
    automake:
      buildable: false
      externals:
      - spec: automake@1.15.1
        prefix: /usr
    gmake:
      buildable: false
      externals:
      - spec: gmake@4.2.1
        prefix: /usr
    cmake:
      buildable: false
      externals:
      - spec: cmake@3.27.7
        prefix: /soft/spack/gcc/0.6.1/install/linux-sles15-x86_64/gcc-12.3.0/cmake-3.27.7-a435jtzvweeos2es6enirbxdjdqhqgdp
    libtool:
      buildable: false
      externals:
      - spec: libtool@2.4.6
        prefix: /usr
    openssl:
      buildable: false
      externals:
      - spec: openssl@1.1.1d
        prefix: /usr
    m4:
      buildable: false
      externals:
      - spec: m4@1.4.18
        prefix: /usr
    zlib:
      buildable: false
      externals:
      - spec: zlib@1.2.11
        prefix: /usr
    pkg-config:
      buildable: false
      externals:
      - spec: pkg-config@0.29.2
        prefix: /usr
    git:
      buildable: false
      externals:
      - spec: git@2.35.3
        prefix: /usr
    cuda:
      buildable: false
      externals:
      - spec: cuda@12.3.2
        prefix: /soft/compilers/cudatoolkit/cuda-12.3.2
        modules:
        - cudatoolkit-standalone/12.3.2
```

## A basic Spack environment

A Spack environment is used to group a set of specs intended for some purpose to be built, rebuilt, and deployed in a coherent fashion. Environments define aspects of the installation of the software, such as:

- Which specs to install;
- How those specs are configured;
- Where the concretized software will be installed.

Please refer to the Spack [environment documentation](https://spack.readthedocs.io/en/latest/environments.html) for further details.

A `spack.yaml` file fully describes a Spack environment, including system-provided packages and compilers. It does so independently of any `compilers.yaml` or `packages.yaml` files installed in `~/.spack`, thereby preventing interference with user-specific Spack configurations by default. To circumvent this behavior and reuse our `compilers.yaml` and `packages.yaml` defined earlier, one can use the `include` heading to pull in external configuration files and applies them to the environment.

Create a `spack.yaml` file in the directory of your liking, and copy the following content to install the packages of interest. In this example, these are PyTorch and Hugging Face's Nanotron:

```yaml {filename="spack.yaml"}
spack:
  include:
  - /home/<username>/.spack/polaris/compilers.yaml
  - /home/<username>/.spack/polaris/packages.yaml
  specs:
  - py-torch@2.5 ~gloo ~valgrind ~caffe2 ~kineto +cuda cuda_arch=80 +nccl +cudnn +magma +distributed
  - py-nanotron
  view: true
```

Finally, use the following commands to build the entire environment with the optimal performance on Polaris:

- `use_polaris`
- `spack env activate`
- `spack install`
