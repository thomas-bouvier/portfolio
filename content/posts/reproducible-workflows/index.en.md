+++
title = "Reproducibility in my HPC and day-to-day workflows"
date = 2025-06-29
description = "A somewhat meandering experience report about reproducibility in HPC workflows and running NixOS on an Apple Silicon Mac."
draft = false
+++

A somewhat meandering experience report about improving reproducibility in High-Performance Computing (HPC) workflows with Spack, and achieving a reproducible desktop environment on an Apple Silicon Mac with NixOS for day-to-day operations.

## Reproducibility in my HPC Workflow: Spack

During my PhD in High-Performance Computing (HPC), I realized the critical importance of reproducibility in experiments. It's essential not only for personal verification and exploration from various angles but also for enabling other researchers to replicate results through hands-on experimentation. An increasing number of initiatives aim to advance the concept of practical reproducibility in HPC, with major conferences even awarding reproducibility badges to qualifying papers, as seen in the [Supercomputing Conference](https://sc24.supercomputing.org/program/papers/reproducibility-initiative/).

However, achieving full reproducibility in HPC is a pipe dream due to several reasons:

- Systems evolve at both hardware (e.g., the interconnect gets upgraded) and software (e.g., system-wide software like the vendored MPI implementation gets updated) levels.
- Supercomputers are not generally available (consider ultra-specialized [Gordon Bell](https://awards.acm.org/bell) runs).

Performance interpretability is probably what HPC scientists should aim for instead. An experiment is interpretable if “it provides enough information to allow scientists to understand the experiment, draw own conclusions, assess their certainty, and possibly generalize results.”

Nevertheless, one can get a bit closer to reproducibility by better managing software dependencies. This is where a package manager like [Spack](https://spack.io/) comes into play. The idea of Spack is to capture the full set of package versions for an HPC environment, including combinations of compilers, MPI versions, build options, and dependency versions. Packages are explicitly parameterized using a spec syntax, bringing order in the combinatorial complexity of packages. Spack introduced me to reproducible environments via `spack.yaml` and `spack.lock` files, which can be versioned in a Git repository. Earlier this year, I wrote a [guide]({{% ref "posts/spack-polaris" %}}) on setting up Spack on a supercomputer.

You can find some of my Spack environments for various HPC platforms [here](https://github.com/thomas-bouvier/spack-envs).

Naturally, I wondered how to manage my desktop environment similarly. That is how I learnt about Nix, a tool that has significantly inspired Spack, as discussed in the [original Spack paper](https://tgamblin.github.io/pubs/spack-sc15.pdf).

## Spack vs. Nix

Spack's DSL is Python, whereas Nix is primarily a programming language. Nix also refers to the Nix package manager, a mostly declarative, fully reproducible software build system. Here are some key [differences between Spack and Nix](https://news.ycombinator.com/item?id=35239166) between Spack and Nix:

- Spack features a dependency solver known as the "concretizer". In contrast, the [nixpkgs](https://github.com/NixOS/nixpkgs) package collection is curated by humans who do the dependency solving over time. This is a major difference: Spack allows to install multiple versions of some package with different dependencies. This flexibility is particularly advantageous in HPC environments, where it is beneficial to run experiments in varied software environments (hackability) or replicate experimental results using someone else's setup. Spack is fundamentally designed to help with such combinatorics. With Nix, you typically get the latest version of a package by default, which is generally desirable for personal computers (although you could do some hacking with Nix derivations to retrieve older versions).

- Another key difference is that Nix builds down to the level of `libc`, whereas Spack currently does not, as it is designed to operate on an existing system.

- Additionally, Nix build environments are isolated but require root access to run. Spack environments, on the other hand, are not as strictly isolated and do not require root access, allowing Spack to be executed within a user's home directory. Again, this aspect of Spack's design is particularly suited to HPC environments, where users should reused system-wide dependencies already installed by the system's administrators. For instance, reusing the vendored MPI implementation is a common practice.

I think Spack would benefit many developers outside of the HPC community as a replacement for tools like Conda or uv. Conversely, while Nix might not be as immediately beneficial for HPC users, tools like [NixOS Compose](https://hal.science/hal-04613983) show potential.


  Aspect | Spack | Nix |
|--------|-------|-----|
| **Dependency Solver** | Uses a dependency solver called the "concretizer" | Managed by humans in the [nixpkgs](https://github.com/NixOS/nixpkgs) collection |
| **Package Versions** | Allows installation of multiple versions of a package with different dependencies | Typically provides the latest version of a package |
| **System Integration** | Designed to live on an existing system | Builds all the way down to `libc` |
| **Isolation** | Environments are not as isolated and do not require root | Build environments are isolated but require root |
| **Binary Reproducibility** | Uses installation hashes as configuration metadata hashes | Supports full configuration hashes |


In the rest of this meandering post, I will explore how the Nix package manager can be used to declare the entire system state of your desktop machine using NixOS.


## NixOS, the Linux distribution

[NixOS](https://nixos.org/) is a Linux distribution built on top of the Nix package manager. It employs declarative configuration files written in Nix to describe the entire state of the operating system, including installed programs and preferences, hardware configuration, system services, settings, and appearance. NixOS is considered immutable (which is a side-effect of being declarative): core capabilities can only be modified via your Nix configuration. As such, updates are atomic, meaning they either happen completely or don't happen at all. This paradigm tosses out a ton of the conventions that most Linux systems rely on, including the layout of the filesystem. Instead of putting things into a bunch of special directories like `/etc`, `/usr/bin`, and so on, everything except your home directory goes into the Nix store located at `/nix`. There's still a `/etc` directory, since a lot of programs expect to find important things in there, but everything inside is a symbolic link to the real "source of truth" in the nix store.

A declarative configuration means that you can reproduce my entire NixOS system as I am running it right now by cloning the [repo hosting it](https://github.com/thomas-bouvier/dotfiles) and using the `nixos-rebuild` command to realize it yourself. My Nix configuration is split up among many files which import each other using `import` statements, but NixOS configurations typically start with `configuration.nix` and `configuration-hardware.nix` files that will grow incrementally as you modify your system.

Each version of the Nix configuration files produces a new system state referred to as a *generation*. One can think of generations as a view made out of symlinks to binaries stored in the Nix store. Each generation gets an entry in the bootloader, making it easy to switch between generations at boot time. This is particularly useful if a breaking change impacts your workflow, allowing you to revert to an older generation.

Unlike other immutable distributions like Fedora Kinoite or Silverblue, generations in NixOS are not pushed by the distribution's maintainers but by the user from their own Nix configuration.

For a good introduction to NixOS, watch [this video](https://www.youtube.com/watch?v=9OMDnZWXjn4) and read the [NixOS and Flakes Book](https://nixos-and-flakes.thiscute.world/preface).



## Advantages of NixOS


For me, NixOS is about control. The declarative nature of NixOS allows me to view the entire system state at a glance in [my configuration](https://github.com/thomas-bouvier/dotfiles). This overview is very appealing as it gives me absolute knowledge of what runs on my computer. If something annoys me, I can fix it permanently. My configuration contains almost everything I've done to the system, making it easy to revisit past changes or troubleshoot issues.

NixOS also provides stability. I have the certainty that the next upgrade won't disrupt my customizations because they are part of my NixOS configuration and the built Nix generation that gets relinked every boot. This stability allows me to maintain a system with minimal requirements and have an "uneventful life" (in computing, I'd say that's a good thing). While it's possible to live without NixOS stability, dealing with potential breaking changes during new releases can be tiresome. NixOS eliminates this concern.

Additionally, the NixOS workflow is very efficient for me. I use my Apple laptop daily and occasionally fall back to my workstation, which has a Nvidia GPU. My configuration files allow me to keep the same system state on both machines. Any new setting or program installed on one computer will be applied to the second during the next rebuild. I actually manage three machines this way, one of them being a [managed distro for relatives](https://www.reddit.com/r/NixOS/comments/1eb1in3/nixos_as_a_managed_distro_for_a_retiree/). I can build the configuration locally using [`nixos-rebuild`](https://nixos.wiki/wiki/Nixos-rebuild) and push it to their machine when on the same local network, potentially using something like Tailscale for remote updates.

Overall, I haven't found NixOS more difficult than other distributions (coming from Fedora, after 5+ years of daily-driving Linux). However, it does require a **significant amount of time** to build a configuration that suits your workflow. Some tasks may be more challenging, but the benefits often outweigh the difficulties for me. When I tried NixOS, it immediately clicked for me, and I wouldn't go back to another distribution. I now feel very limited when using other environments like macOS.

Still, one should definitely get a usable config set up in a VM first, and then move that config to bare metal when it gets robust enough. NixOS has a very steep learning curve, so take your time. Reproducibility means there's no benefit to jumping in to bare metal system right away before you've set up basic desktop utilities. 


## Reproducibility in my day-to-day workflow: NixOS + Asahi Linux

I like Apple laptops. They have significantly better battery life than any other laptop I've used, their build quality is outstanding, and Silicon ARM chips are amazing performers. However, I am really not the right targrt for macOS, which I can't stand.

Naturally, I installed Linux on my Silicon-powered MacBook thanks to the [Asahi Linux](https://asahilinux.org/about/) project. The project's goal is not just to make Linux run on this hardware but to polish it to the point where it can be used as a daily OS (which I do). Achieving this required a tremendous amount of work, as Apple Silicon is an entirely undocumented platform that required reverse-engineering (some areas are still in progress). The first [Asahi Linux alpha release](https://asahilinux.org/2022/03/asahi-linux-alpha-release/) was announced in March 2022. The project is funded by [donations](https://asahilinux.org/support/). All M1 and M2 MacBooks are supported.

I installed Fedora Asahi Linux for the first time in January 2024 on a MacBook Pro M2, and it became my main operating system within a few weeks. While Asahi Linux doesn't yet support external displays via DP Alt and Thunderbolt, I manage this limitation by using an HDMI cable (so, make sure your laptop has one if you plan to use an exteral monitor). Some minor issues I have are:

- HDMI output stops working after sleep.
- The battery drains during sleep.
- The microphone doesn't work on my model, although it is officially supported.

Alright, I've rambled on for a few paragraphs now and haven't got to what I actually wanted to talk about initially. Let's discuss NixOS on Apple's Silicon ARM chips. If you're new to NixOS, I recommend reading the [official NixOS manual](https://nixos.org/manual/nixos/stable/#ch-installation) or watching [this series of videos](https://www.youtube.com/playlist?list=PL-saUBvIJzOkjAw_vOac75v-x6EzNzZq-) before proceeding with NixOS + Asahi Linux together. Once you're familiar with the overall process of installing NixOS, please follow the [guide to install NixOS on Apple Silicon](https://github.com/nix-community/nixos-apple-silicon/blob/main/docs/uefi-standalone.md), which is excellent. I'll add a couple of tips here to save you time.

The installer ISO (that you built yourself or downloaded from [GitHub](https://github.com/nix-community/nixos-apple-silicon/releases)) should be transfered to the USB flash drive using `dd`. Do not mount your USB drive before the transfer.

```console
sudo dd if=nixos-25.05.20250508.dda3dcd-apple-silicon-release-2025-05-10.iso of=/dev/sdX status=progress bs=4M
```

Once you've booted from the installer ISO, you'll notice that the included environment is minimal yet sufficient to begin the setup process. When setting up a new NixOS machine, I usually modify the default config (`configuration.nix` and `hardware-configuration.nix` files) to create a user account `thomas`, set an initial password, enable the network manager, and install `vim` and `git`. This setup allows me to clone my [full config](https://github.com/thomas-bouvier/dotfiles) and tweak it further if needed. Alternately, you can build your own config incrementally from the default `configuration.nix` and `hardware-configuration.nix` located in `/etc/nixos`. You [should](https://github.com/nix-community/nixos-apple-silicon/blob/main/docs/uefi-standalone.md#apple-silicon-support-updates) then import the [support module](https://github.com/nix-community/nixos-apple-silicon) that adds all the special sauce that makes the Apple hardware work.

I use [Nix Flakes](https://nixos.wiki/wiki/Flakes), which is a way to structure Nix projects that explicitly "locks down" all inputs, including the specific commit of [nixpkgs](https://github.com/NixOS/nixpkgs) and other referenced inputs. This `flake.lock` functionality improves reproducibility compared to using channels. To get the Asahi stuff into my Flake repository, I added the support module input to the [`flake.nix`](https://github.com/thomas-bouvier/dotfiles/blob/main/flake.nix) file as follows:

```nix {filename="flakes.nix"}
{
  description = "NixOS configuration";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
    nixpkgs-unstable.url = "github:nixos/nixpkgs/nixos-unstable";

    apple-silicon = {
      url = "github:nix-community/nixos-apple-silicon";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  # ...
}
```

I referenced `apple-silicon.nixosModules.apple-silicon-support` to include the hardware support module from my flake. The line `nixpkgs.overlays = [ apple-silicon.overlays.apple-silicon-overlay ];` adds an overlay that extends the default nixpkgs with Asahi-specific components. In the following, `amanite` refers to my Apple laptop's hostname:


```nix {filename="flakes.nix"}
nixosConfigurations.amanite = nixpkgs.lib.nixosSystem {
  system = "aarch64-linux";
  specialArgs = {
    inherit inputs;
  };

  modules = [
    (
      { pkgs, ... }:
      {
        nixpkgs.overlays = commonOverlays ++ [
          (mkUnstableOverlay pkgs)
          apple-silicon.overlays.apple-silicon-overlay
        ];
      }
    )

    apple-silicon.nixosModules.apple-silicon-support
    ./hosts/amanite/default.nix
  ];
};
```

Before building and applying the configuration, I needed to address one more issue. By default, the `nixos-apple-silicon` module loads firmware files from the `/boot/asahi` directory, which won't work with Nix flakes by default. Flakes should be "self contained", so reading files outside of the flake repo is restricted. Before installing NixOS via `nixos-install`, ensure you backup the non-free peripheral firmware files required to use system hardware like Wi-Fi or the trackpad. Copy these files from the EFI system partition (e.g. on the installation ISO `mkdir -p /mnt/etc/nixos/firmware && cp /mnt/boot/asahi/{all_firmware.tar.gz,kernelcache*} <dotfiles>/system/asahi-firmware`) into your flake repo (change the last path accordingly). I do not push these firmware files to GitHub. Please have a look at my project structure for clarity:

```console
hosts
├── amanite
│   └── default.nix
├── bolet
│   └── default.nix
├── coprin
│   └── default.nix
└── README.md
system
├── asahi-firmware
│   ├── all_firmware.tar.gz
│   └── kernelcache.release.mac14j
├── bluetooth.nix
├── configuration.nix
├── icon.nix
├── networking.nix
├── nvidia.nix
├── printing.nix
├── stylix.nix
└── tailscale.nix
users
├── famille
│   ├── default.nix
│   ├── librewolf.nix
│   └── plasma.nix
├── thomas
│   ├── assets
│   │   ├── aliases.zsh
│   │   ├── avatar.png
│   │   ├── avatar.svg
│   │   ├── bindkey.zsh
│   │   ├── g5k
│   │   └── ide
│   ├── atuin.nix
│   ├── default.nix
│   ├── konsole.nix
│   ├── librewolf.nix
│   ├── plasma.nix
│   ├── ssh.nix
│   ├── tmux.nix
│   ├── vscode.nix
│   └── zsh.nix
├── famille.nix
└── thomas.nix
flake.lock
flake.nix
README.md
```

For completeness, here is my current Apple Silicon [hardware configuration](https://github.com/thomas-bouvier/dotfiles/blob/main/hosts/amanite/default.nix) located at `<dotfiles>/hosts/amanite/default.nix`:

```nix {filename="default.nix"}
{ config, lib, pkgs, modulesPath, ... }:

{
  imports = [
        (modulesPath + "/installer/scan/not-detected.nix")
        ../../system/configuration.nix

        # Users
        ../../users/thomas.nix
    ];

    networking.hostName = "amanite";

    boot = {
        # Use the systemd-boot EFI boot loader.
        loader.systemd-boot.enable = true;
        loader.efi.canTouchEfiVariables = false;

        initrd.availableKernelModules = [ "usb_storage" "sdhci_pci" ];
        initrd.kernelModules = [ ];

        kernelModules = [ ];
        extraModulePackages = [ ];

        extraModprobeConfig = ''
            options hid_apple iso_layout=0
        '';
    };

  hardware.asahi = {
    peripheralFirmwareDirectory = ../../system/asahi-firmware;
    withRust = true;
    useExperimentalGPUDriver = true;
    experimentalGPUInstallMode = "replace";
  };

  fileSystems."/" =
    { device = "/dev/disk/by-uuid/<uuid>";
      fsType = "ext4";
    };

  fileSystems."/boot" =
    { device = "/dev/disk/by-uuid/<uuid>";
      fsType = "vfat";
      options = [ "fmask=0022" "dmask=0022" ];
    };

  swapDevices = [ ];

  # Enables DHCP on each ethernet and wireless interface. In case of scripted networking
  # (the default) this is the recommended approach. When using systemd-networkd it's
  # still possible to use this option, but it's recommended to use it in conjunction
  # with explicit per-interface declarations with `networking.interfaces.<interface>.useDHCP`.
  networking.useDHCP = lib.mkDefault true;
  # networking.interfaces.wlan0.useDHCP = lib.mkDefault true;

  nixpkgs.hostPlatform = lib.mkDefault "aarch64-linux";
}
```

Once you have a similar setup, run `nixos-install` or `nixos-install --flake` to realize your configuration. This command performs tasks such as partitioning disks, setting up the filesystem, and installing the bootloader, in addition to configuring the system according to the provided Nix project.


## Handling Multiple Machines (Hosts)

Reconnecting from NixOS? Congratulations!

Before concluding, I'd like to briefly explain how I manage multiple hosts running NixOS. I explained above that one of the appeals of reproducibility for me is maintaining the same configuration across my laptop (hostname `amanite`), desktop computer (hostname `bolet`) and my relative's computer (hostname `coprin`). All these hosts are configured in the same Flake repo, with each host being an output of that flake (you could imagine some extra outputs too, like an ISO image for instance):

```nix {filename="flake.nix"}
outputs =
  {
    self,
    nixpkgs,
    nixpkgs-unstable,
    apple-silicon,
    home-manager,
    ...
  }@inputs:
  let
    forAllSystems = function:
      nixpkgs.lib.genAttrs [
        "x86_64-linux"
        "aarch64-linux"
      ] (system: function nixpkgs.legacyPackages.${system});

    commonOverlays = [
      ...
    ];

    mkUnstableOverlay = pkgs: (final: prev: {
      unstable = import nixpkgs-unstable {
        inherit (pkgs) system;
      };
    });
  in
  {
    nixosConfigurations.bolet = nixpkgs.lib.nixosSystem {
      system = "x86_64-linux";
      specialArgs = {
        inherit inputs;
      };

      modules = [
        (
          { pkgs, ... }:
          {
            nixpkgs.overlays = commonOverlays ++ [ (mkUnstableOverlay pkgs) ];
          }
        )

        ./hosts/bolet/default.nix
      ];
    };

    nixosConfigurations.coprin = nixpkgs.lib.nixosSystem {
      system = "x86_64-linux";
      specialArgs = {
        inherit inputs;
      };

      modules = [
        (
          { pkgs, ... }:
          {
            nixpkgs.overlays = commonOverlays ++ [ (mkUnstableOverlay pkgs) ];
          }
        )

        ./hosts/coprin/default.nix
      ];
    };

    nixosConfigurations.amanite = nixpkgs.lib.nixosSystem {
      system = "aarch64-linux";
      specialArgs = {
        inherit inputs;
      };

      modules = [
        (
          { pkgs, ... }:
          {
            nixpkgs.overlays = commonOverlays ++ [
              (mkUnstableOverlay pkgs)
              apple-silicon.overlays.apple-silicon-overlay
            ];
          }
        )

        apple-silicon.nixosModules.apple-silicon-support
        ./hosts/amanite/default.nix
      ];
    };
  };
```

My flake repo has a `hosts` directory where each host has a directory for its module. These hosts have a single `default.nix` in their directory, although they could have entire directory trees of modules. Each host imports common modules from other directories, such as `system` for system-wide packages and common applications. This approach could be broken out further with some kind of "host groups" abstraction, but I haven't felt the need for this yet. Additionally, each host module imports any specific things it needs, including user accounts from the `users` directory. For example, desktop computers import Nvidia stuff, while my MacBook config does not.

The following command allows rebuilding the system. The `#amanite` part refers to an output attribute defined in the flake above, corresponding to the specific host I want to realize:

```console
nixos-rebuild switch --flake .#amanite --sudo
```

I can also specify a `--target-host` to build one host locally and deploy it to a target machine. This is how I manage my relative's computer:

```console
nixos-rebuild switch --flake .#coprin --target-host thomas@192.168.1.30 --sudo
```

Finally, I learned that updates can be a pain when managing multiple hosts on different CPU architectures (`amanite` is `aarch64` and `bolet`/`coprin` are `x86_64`) or/and filling different roles. The problem may arise when I `nix flake update` my repo (to update `flake.lock` to a more recent version of nixpkgs), which then requires me to upgrade every machine accordingly. If I skip one, then I'd have a backlog of upgrades to apply when I eventually use that machine again.

To address this, one approach would be to create a Git branch for each host (e.g. `hosts/amanite`, `hosts/bolet`, etc). When everything is up-to-date, these branches all point to the latest commit of the main branch of my Flake repo. This way, I could push updates to main and upgrade hosts one at a time. I could also diff the host branch with main to see what has changed since the last update. And finally, I could experiment with changes on one host for an extended period of time and merge them to the main branch when ready. I haven't put this workflow into practice yet, but I'm strongly considering it.


## Wrapping up

And now I'm geeking a bit too hard, so it's time to wrap up. In this somewhat chaotic article (like what's going on in my head all the time), I've explored several key points:

- The importance of reproducibility in computing, particularly in academic work.
- How I improved the reproducibility of my HPC workflows using Spack.
- Managing desktop environment dependencies with Nix and the daily benefits I derive from NixOS.
- Managing multiple machines, including a MacBook running Asahi Linux.

I hope you'll get some insights from my journey. Please don't hesitate to contact me if you'd like a more detailed article on a specific point, as this one is more of an overview.