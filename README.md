<br />
<div align="center">
<span id="readme-top"></span>
<h3 align="center">Tranga-Website</h3>

  <p align="center">
    Automatic Manga and Metadata downloader 
  </p>
  <p align="center">
    This is the Website for <a href="https://github.com/C9Glax/tranga">Tranga</a> (API)  
  </p>

  ![GitHub License](https://img.shields.io/github/license/C9glax/tranga-website)

  <table>
    
  </table>
</div>

<!-- FORK CHANGES -->
## Changes in this fork

This is [Nikibasso94](https://github.com/Nikibasso94)'s fork of [C9Glax/tranga-website](https://github.com/C9Glax/tranga-website), with the following fixes and additions on top of upstream (pairs with the matching [tranga fork](https://github.com/Nikibasso94/tranga)):

**New features**
- Live "Downloads" view showing per-chapter download progress in real time, and a "Missing Chapters" view per manga
- Per-Manga chapter download progress bar on the main list, showing downloaded/total count directly on the bar (red while incomplete, green when done)
- "Force (re)download" button for a Chapter, wired up to actually delete and re-download it
- Confirmation dialog before deleting a Manga, with an explicit choice between deleting its downloaded files or just removing it from the library and keeping them
- The Actions (audit log) page now shows the Manga name and chapter number instead of generic "Manga"/"Chapter" links
- Tooltips added to icon-only nav buttons (Downloads, Actions) that previously had no label at all
- Search box and an A-Z jump index on the home page to quickly find a monitored manga in a large library

**Fixes**
- Fixed the Downloads page never showing live progress: nginx wasn't proxying the SignalR WebSocket upgrade for the download-progress hub
- Fixed the chapter download-source toggle acting on the wrong link when a chapter has two links from the same connector (pairs with the backend fix)
- Fixed a broken `npm` invocation in the Dockerfile, and added the build toolchain + native-module approval needed to compile `better-sqlite3` on Alpine

**Infrastructure**
- Docker images are published to `ghcr.io/nikibasso94/tranga-web` instead of the upstream Docker Hub namespace

<!-- ABOUT THE PROJECT -->
## Screenshots

| ![Main Page](Screenshots/Overview.png) | ![Search](Screenshots/Search.png) | ![Manga Detail](Screenshots/MangaDetail.png) |
|----------------------------------------|------------------------------------------|------------------------------------------------|
| Overview                               | Search Dialog                            | Manga Detail                                   |

## About The Project

Tranga-Website is the Web-frontend to [Tranga](https://github.com/C9Glax/tranga) (the API).

### What this does do (and nothing else)

This project makes HTTP-requests to the [Tranga-API](https://github.com/C9Glax/tranga) to display and modify the present configuration.

## Built With

- nginx
- [nuxt](https://github.com/nuxt/nuxt)
- [nuxt ui](https://github.com/nuxt/ui)
- [vue](https://github.com/vuejs/)
- [vite](https://github.com/vitejs/vite)
- 💙 Blåhaj 🦈

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->
## Getting Started

Go to [Tranga](https://github.com/C9Glax/tranga?tab=readme-ov-file#getting-started) and read the README there.

<!-- CONTRIBUTING -->
## Contributing

Go to [Tranga](https://github.com/C9Glax/tranga?tab=readme-ov-file#contributing) and read the README there.

<!-- LICENSE -->
## License

See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

* [Choose an Open Source License](https://choosealicense.com)
* [Font Awesome](https://fontawesome.com)
* [Best-README-Template](https://github.com/othneildrew/Best-README-Template/tree/master)

<p align="right">(<a href="#readme-top">back to top</a>)</p>
