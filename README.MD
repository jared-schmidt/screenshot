### TODOs
- [ ] Clean up readme
- [ ] Do TODOs in code
- [ ] Clean up code
- [ ] better to install chrome / use puppeter-core?

### Local
1. `npm install`
2. `npm start`
3. Go to http://localhost:3000/?link=https://www.google.com&selector=canvas&width=1024&height=350 (TEMP URL)


### Docker
1. `docker build -t screenshot .`
2. `docker run -it -p 8001:3000 -d screenshot`

Go to http://localhost:8001/?link=https://www.google.com&selector=canvas&width=1024&height=350 (TEMP URL)

To get logs:
1. `docker ps` (for container id)
2. `docker logs -f [container id]`