import { AnimationClip, AnimationMixer } from "three";

import HTMLControl from "../HTMLControl.js";

export default class AnimationControls {
  constructor() {
    this.isPaused = false;
    this.pauseButtonActive = false;

    this.clips = [];
    this.mixers = [];
    this.actions = [];
    this.animationNames = [];
  }

  reset() {
    this.clips = [];
    this.mixers = [];
    this.actions = [];
    this.animationNames = [];

    this.currentMixer = null;
    this.currentAction = null;
    this.isPaused = false;
    this.pauseButtonActive = false;

    // HTMLControl.animation.playbackControl.removeEventListener( 'click', this.playPause, false );
    // HTMLControl.animation.slider.removeEventListener( 'mousedown', this.sliderMouseDownEvent, false );
    // HTMLControl.animation.slider.removeEventListener( 'input', this.sliderInputEvent, false );
    // HTMLControl.animation.slider.removeEventListener( 'mouseup', this.sliderMouseupEvent, false );
    // HTMLControl.animation.clipsSelection.removeEventListener( 'change', this.clipsChangeEvent, false );
  }

  update(delta) {
    // delta is in seconds while animations are in milliseconds so convert here
    if (this.currentMixer && this.currentAction && !this.isPaused) {
      this.currentMixer.update(delta / 1000);

      // this.currentMixer.time increases indefinitely, whereas this.currentAction.time
      // increases modulo the animation duration, so set the slider value from that
      this.setSliderValue(this.currentAction.time);
    }
  }

  initAnimation(object) {
    // don't do anything if the object has no animations
    if (!object.animations || object.animations.length === 0) return;

    object.animations.forEach((animation) => {
      if (!(animation instanceof AnimationClip)) {
        console.warn(
          "Some animations are not valid THREE.AnimationClips. Skipping these."
        );

        return;
      }

      const mixer = new AnimationMixer(object);

      const action = mixer.clipAction(animation);

      this.clips.push(animation);
      this.mixers.push(mixer);
      this.actions.push(action);
      this.animationNames.push(animation.name);

      // HTMLControl.animation.clipsSelection.appendChild( new Option( animation.name, animation.name ) );
    });

    // If all animations have been skipped, return
    if (this.animationNames.length === 0) return;

    this.selectCurrentAnimation(this.animationNames[0]);

    // HTMLControl.animation.controls.classList.remove( 'hide' );

    // this.initPlayPauseControls();

    // this.initSlider();

    // this.initSelectionMenu();
  }

  selectCurrentAnimation(name) {
    const index = this.animationNames.indexOf(name);

    if (index === -1) {
      console.warn("Animation " + name + " not found.");
    } else {
      if (this.currentAction) this.currentAction.stop();

      this.currentMixer = this.mixers[index];
      this.currentAction = this.actions[index];
      this.currentClip = this.clips[index];

      // set animation slider max to length of animation
      // HTMLControl.animation.slider.max = String( this.currentClip.duration );

      // HTMLControl.animation.slider.step = String( this.currentClip.duration / 150 );

      this.currentAction.play();
    }
  }

  setSliderValue(val) {
    // HTMLControl.animation.slider.value = String( val );
  }

  initPlayPauseControls() {
    this.playPause = (e) => {
      e.preventDefault();

      this.togglePause();
    };

    // HTMLControl.animation.playbackControl.addEventListener( 'click', this.playPause, false );
  }

  togglePause() {
    if (!this.isPaused) {
      this.pauseButtonActive = true;
      this.pause();
    } else {
      this.pauseButtonActive = false;
      this.play();
    }
  }

  pause() {
    this.isPaused = true;
    // HTMLControl.animation.playButton.classList.remove( 'hide' );
    // HTMLControl.animation.pauseButton.classList.add( 'hide' );
  }

  play() {
    this.isPaused = false;
    // HTMLControl.animation.playButton.classList.add( 'hide' );
    // HTMLControl.animation.pauseButton.classList.remove( 'hide' );
  }
}
