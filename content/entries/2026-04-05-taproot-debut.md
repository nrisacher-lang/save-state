---
date: "2026-04-05"
project: taproot
session: "Taproot — debut"
tags: [launch, infrastructure]
type: debut
---

## Features

- Taproot is an old Windows PC converted to a Proxmox VE 9.1.1 homelab server — purpose-built
  for self-hosting services and learning infrastructure hands-on
- The design principle is progressive self-sufficiency: start with monitoring and password
  management, build toward hosting AI services and running production workloads off the cloud
- Foundation complete — Proxmox installed, ZFS single-disk pool on 2TB HDD, LXC containers
  running Ubuntu 24.04 with Docker, Uptime Kuma live on port 3001

## Lessons

- A single-disk ZFS pool has no redundancy, but acceptable for a learning server — the
  constraint forces clarity about what data actually needs protection
- Proxmox's browser console has a display glitch that drops output; SSH into containers is
  the reliable path for any real terminal work
- ISP-level DNS blocking (port 53 to 8.8.8.8) surfaces early — router-as-DNS is the
  practical workaround, not a configuration mistake to fix later
