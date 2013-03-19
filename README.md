#Pub-Sub

Lightweight (less than .5k minified) pubsub with a few nice features.

There are two versions - pubsub and pubsub.sep (along with their jQuery counterparts). The difference between the two is the publish method and how it is called. It's really a matter of preference which you choose as they both work in a very similar way. The documentation for these two different implentations will only differ on the publish method(s) - everything else is the same.

##Publishing
Publishing can be as simple as just passing a string (the named event) to the publish method.

    I.publish("myEvent");

All callbacks that are currently subcribed when that event is published will be called. They will be called in the order that they subscribed, however they are all asynchronous so there is no guarantee for which order they will be executed in.

####Publish Options

There are three options you can pass in as an (optional) object to the publish method.

    args (array)   - an array of arguments to pass to all subscribers.
    
    scope (object) - what you want "this" to be inside of your subscribers' callback functions
    
    sync (boolean) - make the publish 'synchronous' - essentially this will wait for all subscribers to be done subscribing before the event is published

####Asynchronous vs Synchronous Publishes

There are two ways to publish something - asynchronous and 'synchronous'. There are only a few use cases where a synchronous publish should be used, as it hinders performance significantly. 

One of the most common examples of why you would want to use a synchronous publish would be when you publish something immediately upon loading whatever it is that is publishing (i.e. a module) before a subscriber has a chance to subscribe to the event. 

Example:

    I.publish("myEvent"); // async publish by default
    I.subscribe("myEvent", function(){
      console.log("myEvent was fired."); // this won't happen
    });


In the above example, the console.log will never happen unelss that event is published again in the future. The way to get around this is to use a synchronous publish:

    I.publish("myEvent", { 
      sync:true // sync publish
    });
    I.subscribe("myEvent", function(){
      console.log("myEvent was fired"); // this will hapen
    });


#####All Options Example

    var arguments = ['param1', 'param2'],
      myObj = someModule();
      
    I.publish("myEvent", {
      args:  arguments,
      scope: myObj,
      sync:  false
    });

##Subscribing

Subscribing is simple: just supply the name of the event you're waiting for and the callback you want to happen when the event is fired.

    I.subscribe('myEvent', function(){
      // do stuffs
    });

##Unsubscribing

When you subscribe to an event, you can create a handle that will have the ability to unsubscribe for you.
    
    var handle = I.subscribe('myEvent', function(){
      // do stuffs
    });
    
Once you create this handle, you can use it to unsubscribe that specfic callback from the event pool.

    I.unsubscribe(handle);
    
###Subscribing once

There is a convenience method in place that will allow you subscribe to an event only once immediately unsubscribe once the subscriber's callback has been fired. In this case, you don't need to create a handle.

    I.subscribeOnce('myEvent', function(){
      // do stuffs
    });
    
    I.publish('myEvent'); // the subscriber callback will be fired this time
    I.publish('myEvent'); // the subscriber callback will no longer be fired
    
##jQuery Plugin

There is also a jquery plugin version of this included in the repo. All of the usage is the same, except that you'll be using the jQuery namespace to publish and subscribe.

    // assuming $ === jQuery

    var handle = $.subscribe('myEvent', function(){
      // do stuffs
    });
    
    $.publish('myEvent');
    
    $.unsubscribe(handle);
    
    // etc.
