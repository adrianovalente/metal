<p align="center">
<img src="https://user-images.githubusercontent.com/8186616/58221417-d6d43880-7ce8-11e9-910c-7f4a55b96cf4.png" />
<h2 align="center">Let there be light.</h2>
</p>

[![Build Status](https://travis-ci.com/adrianovalente/metal.svg?token=sXzfpyZgxDGcjGqaejqQ&branch=master)](https://travis-ci.com/adrianovalente/metal)

This is the service that runs on ~metal~ my [Raspberry Pi](https://www.raspberrypi.org) to control the status of the lights in my room. It subscribes to a [Redis](https://redis.io/topics/pubsub) topic and waits for updates on the remote status, in order to trigger the needed I/O changes on hardware.

### Getting Started
This is a [NodeJS](https://nodejs.org/en/) application tested using the [Jest](https://jestjs.io) framework. To get a local copy of this project for testing and development purposes, just clone it and install the dependencies:

``` bash
npm install
npm test
```
