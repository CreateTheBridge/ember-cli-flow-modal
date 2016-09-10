import Ember from 'ember';

const {
  Component,
  observer,
  computed
} = Ember;

const {
  scheduleOnce
} = Ember.run;

export default Component.extend({
  classNames: ['flow--modal'],
  classNameBindings: ['visible:active', 'class'],
  contentTransitionTime: 300,
  backgroundTransitionTime: 300,
  totalTransitionTime: computed('contentTransitionTime', 'backgroundTransitionTIme', function() {
    let { contentTransitionTime, backgroundTransitionTime } = this.getProperties('contentTransitionTime', 'backgroundTransitionTime');
    return contentTransitionTime + backgroundTransitionTime;
  }),
  transition: 'slideUpIn',
  exitTransition: 'slideDownOut',

  visibilityDidChange: observer('visible', function() {
    let {
      visible,
      contentTransitionTime,
      backgroundTransitionTime,
      totalTransitionTime
    } = this.getProperties(
      'visible',
      'contentTransitionTime',
      'backgroundTransitionTime',
      'totalTransitionTime'
    );

    var $element = this.$(),
        $background = $element.find('.modal--background'),
        $content = $element.find('.modal--content');

    if (visible) {
      console.log("DEBUG: Showing the modal");
      $element.css('display', 'block');
      $background.velocity({
        opacity: 1
      }, {
        duration: backgroundTransitionTime
      });

      $content.velocity(`transition.${this.get('transition')}`, {
        delay: backgroundTransitionTime,
        duration: contentTransitionTime
      });
    } else {
      console.log("DEBUG: Hiding the modal");
      $content.velocity(`transition.${this.get('exitTransition')}`, {
        duration: contentTransitionTime
      });

      $background.velocity({
        opacity: 0
      }, {
        duration: backgroundTransitionTime,
        delay: contentTransitionTime
      });

      setTimeout(() => {
        $element.css('display', 'none');
      }, totalTransitionTime);
    }
  }),

  didInsertElement() {
    this._super();


    scheduleOnce('afterRender', this, () => {
      var $element = this.$().find('.modal--background');

      $element.click(() => {
        this.set('visible', false);
      });
    });
  },

  actions: {

    closeModal() {
      this.set('visible', false);
    }

  }
});
