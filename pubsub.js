/** 
 * You can change what namespace you want this to be in by changing the first
 * I right below. For instance, if you'd rather use "p", change "I" to p. 
 */
(I = function(undef){
  'use strict';
  var cache = {},
    I = {};

  /**
   * Publishes an event to whoever's listening
   * Example: 
   *   I.publish("myEvent", {
   *     args: ['param1', 'param2'],
   *     scope: document,
   *     sync: false
   *   });
   * 
   * @param {string} topic The name of the event
   * @param {object.array} args The arguments to pass to the subscriber callback
   * @param {object.object} scope The Scope that will used for the callback 
   * @param {object.bool} sync Make synchronous. This is used to make sure
   *   that the published event is allowing for all subscribers to know that
   *   the event was published. Typical use for this would be when an event
   *   is to be published when the app loads and a sandbox.publish call is
   *   made before a subscriber has a chance to subscribe to it.
   */
  I.publish = function (topic, options) {
    var opts = options || {},
      args = opts.args || [],
      scope = opts.scope || this,
      sync = opts.sync || false,
      doPublish = function () {
        var i, thisTopic;

        if (cache[topic]) {
          thisTopic = cache[topic];
          
          for (i = thisTopic.length - 1; i >= 0; i -= 1) {
            thisTopic[i].apply(scope, args);
          }
        }
      };

    if (sync) {
      setTimeout(doPublish, 0);
    } else {
      doPublish(); 
    }
  };

  /**
   * Subscribes to an event and stores the callback for later use (when the
   * event is called via sandbox.publish).
   *
   * Example:
   *   var handle = I.subscribe("myEvent", function() {
   *     // do stuff
   *   });
   *
   * @param {string} topic The name of the event
   * @param {function} callback The callback method to store for later use
   * @return {array} The event handler
   */
  I.subscribe = function (topic, callback) {
    if (!cache[topic]) {
      cache[topic] = [];
    }
    cache[topic].push(callback);
    return [topic, callback];
  };

  /**
   * Subscribes to an event only the first time the event is called.
   *
   * Example:
   *   I.subscribeOnce("myEvent", function() {
   *     // do stuff only once
   *   });
   *
   * @param {string} topic The name of the event
   * @param {function} callback The callback for the event
   */
  I.subscribeOnce = function (topic, callback) {
    var fireAndForget = function (handle, args, scope) {
      callback.apply(scope, args);
      I.unsubscribe(handle);
    },
        
    handle = I.subscribe(topic, function () {
      fireAndForget(handle, arguments, this);
    });
  };

  /**
   * Unsubscribes to an event
   *
   * var handle = I.subscribe("myEvent", function () {
   *   // do stuff
   * });
   * I.unsubscribe(handle);
   *
   * @param {array} handle The event handler
   */
  I.unsubscribe = function (handle) {
    var t = handle[0],
      i = cache[t].length - 1;

    if (cache[t]) {
      while (i >= 0) {
        if (cache[t][i] === handle[1]) {
          cache[t].splice(cache[t][i], 1);
        }
        i -= 1;
      }
    }
  };

  return I;
}());
