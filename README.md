# docker-appinsights-logger

[![js-standard-style](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://github.com/feross/standard)
[![Docker Build Status](https://img.shields.io/docker/build/jameskyburz/appinsights-logger.svg)]()
[![Docker Pulls](https://img.shields.io/docker/pulls/jameskyburz/appinsights-logger.svg)]()

### Docker

Docker images hosted at https://hub.docker.com/r/jameskyburz/appinsights-logger/

docker pull jameskyburz/appinsights-logger:version

# Running in docker

```sh
ᐅ docker pull jameskyburz/appinsights-logger:version
ᐅ docker run \
  --name appinsights \
  -e AI_KEY=x \
  -e AI_LOGGER=x \
  -v /var/run/docker.sock:/var/run/docker.sock \
  jameskyburz/appinsights-logger:version
```

# license

[Apache License, Version 2.0](LICENSE)
