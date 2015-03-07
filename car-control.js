pc.script.create('car_control', function (app) {
    // Creates a new Car_control instance
    var Car_control = function (entity) {
        this.entity = entity;
    };

    Car_control.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
            this.velocity = new pc.Vec3();
        },
        
        reset: function(){
            this.entity.setPosition(0,0,0);
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
        }
    };

    return Car_control;
});