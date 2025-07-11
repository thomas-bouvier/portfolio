+++
title = "Recovering from a broken Nix interpreter"
date = 2025-07-10
description = "How I could fix my NixOS systems made unstable by the recent correctness bug in Lix."
draft = false
+++

I use [Lix](https://lix.systems/) as my preferred Nix package manager. The Lix update addressing CVE-2025-52992, [released on June 24th](https://lix.systems/blog/2025-06-24-lix-cves/), inadvertently introduced a critical regression that impacted derivation builds. This issue resulted in missing store paths, leading to system instability in my setup. In this post, I'll walk you through the steps I took to repair my NixOS systems.


## Summary

Lix is a modern implementation of the Nix package manager [which I use as a NixOS module](https://lix.systems/add-to-config/). This post mirrors the [official post](https://lix.systems/blog/2025-06-27-lix-critical-bug/) providing guidance on fixing the issue, supplemented with the commands that worked for me. I hope this information proves helpful to others, both now and in the future.

To begin, check your Lix version with:

```
nix --version
```

The affected Lix versions are:

- Lix 2.91.2
- Lix 2.92.2
- Lix 2.93.1

Maybe you won't even be able to run `nix` commands (because of a missing path?). If so, check your Nix configuration to determine your current Lix version.

```
nix: error while loading shared libraries: libeditline.so.1: cannot open shared object file: No such file or directory
```

If you've already upgraded to one of the affected versions, proceed carefully with the instructions below. If not, you can skip to the remediation section and rebuild your system as you usually do.

## What to do if you're on an affected Lix version

First, stop the Nix daemon to prevent further issues:

```
systemctl stop nix-daemon.service nix-daemon.socket
```

The idea now is to rely on a non-broken static Nix binary to execute recovery commands without making things worse. You can download the appropriate binary from https://hydra.nixos.org, the official build farm of `nixpkgs`:

- [x86_64 Linux](https://hydra.nixos.org/job/nixpkgs/trunk/lixStatic.x86_64-linux/latest/download-by-type/file/binary-dist)
- [aarch64 Linux](https://hydra.nixos.org/job/nixpkgs/trunk/lixStatic.aarch64-linux/latest/download-by-type/file/binary-dist) (if you're using NixOS on an Apple Silicon for instance)

Create a symlink to the `nix` binary you just downloaded:

```
ln -s ./nix ./nix-store
```

### Checking your system’s store

Use the symlinked `nix-store` to perform a comprehensive check of the Nix store:

```
sudo NIX_REMOTE=local ./nix-store --verify --repair --check-contents
```

The flag `--check-contents` might not be necessary, but in my case, some binaries had checksum mismatches that needed repair. This has most probably nothing to do with the current Lix bug, but it's a problem I've found out about and dealt with in passing. This issue is likely unrelated to the current Lix bug, but it's something I addressed along the way. If the check-up doesn't report any failures, you can proceed to the remediation and subsequent sections.

Here's an example of a missing path on my system:

```
error:
... while setting up the build environment

       error: getting attributes of path ‘/nix/store/swyh8mra0qk5118lpdc1ycqgraqg121w-busybox-static-x86_64-unknown-linux-musl-1.36.1/bin/busybox’: No such file or directory
```

If you have missing paths, try to repair them using the following command:

```
sudo NIX_REMOTE=local ./nix-store -r /nix/store/swyh8mra0qk5118lpdc1ycqgraqg121w-busybox-static-x86_64-unknown-linux-musl-1.36.1 --repair
```

Run the check-up again and try to recover any missing paths that might be logged. Ideally, the check-up should eventually stop reporting failures. If not, proceed with the next section anyway.

### Remediation

Update to one of the newest minor of Lix using `lix-project/nixos-module`. Non-affected versions are:

- Lix 2.91.3 (tag: `2.91.3-1`)
- Lix 2.92.3 (tag: `2.92.3-1`)
- Lix 2.93.2 (tag: `2.93.2-1`)

### Update to a sane Lix version

Attempt rebuilding your system from the static Nix binary after you changed your configuration:

```
sudo NIX_REMOTE=local ./nix --experimental-features 'nix-command flakes' build /path/to/flake/repo#nixosConfigurations.<hostname>.config.system.build.toplevel --repair
```

You will likely encounter more errors. Try to repair missing paths as they appear. Sometimes the build night stall: interrupt it and launch it again. The process was painful to me. If the build stalls, interrupt it and restart. This process was quite painful for me. If it stalls repeatedly, consider adding verbosity flags `-vv` to gather more information. You can also try executing the command without the `--repair` flag.

Once the the build is successful, switch to the new configuration using:

```
./result/bin/switch-to-configuration switch
```

Ensure that you've switched to a stable Lix version using `nix store ping`:

```
Store URL: daemon
Version: 2.93.2
Trusted: 1
```

Initially, I was still stuck on the broken Lix version, as if the version update in my configuration hadn't been applied. To resolve this, I navigated to my flake repository, updated it using `nix flake update`, rebuilt my system using the instructions above, and switched to it again using `./result/bin/switch-to-configuration switch`. Finally, I was running a stable version of the Nix interpreter.

Lastly, navigate to your Flake repository and rebuild your system as usual:

```
cd /path/to/flake/repo
nixos-rebuild switch ...
```

Reboot into the new bootloader entry and verify that you're running a sane Nix interpreter using `nix store ping` once more :)

```
Store URL: daemon
Version: 2.93.2
Trusted: 1
```
