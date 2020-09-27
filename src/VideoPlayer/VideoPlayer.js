import React from 'react';
import videojs from 'video.js';
import './myVideo.css';

export default class VideoPlayer extends React.Component {
    componentDidMount() {
        this.props = {
            autoplay: true,
            controls: true,
            sources: [{
                src: this.props.src,
                type: 'application/x-mpegURL'
            }]
        };
        this.player = videojs(this.videoNode, this.props, function onPlayerReady() {
            console.log('onPlayerReady', this);
        });
        this.player.play();
    }
    componentWillUnmount() {
  
        if (this.hls) {
            this.hls.destroy();
          }
    }
    render() {
        return (
            <div>
                <div data-vjs-player>
                    <video ref={ node => this.videoNode = node } className="video-js vjs-default-skin video" autoPlay="autoPlay"></video>
                </div>
            </div>
        );
    }
}
