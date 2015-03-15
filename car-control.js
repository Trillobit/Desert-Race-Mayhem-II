pc.script.create('car_control', function (app) {
    // Creates a new Car_control instance
    var Car_control = function (entity) {
        this.entity = entity;
    };

    Car_control.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
            this.velocity = new pc.Vec3();
            this.torque = 7;
            this.thrust = 7;
        },
        
        reset: function(){
            this.entity.setPosition(0,0,0);
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
            
            if (app.keyboard.isPressed(pc.KEY_LEFT)) {
                
                this.entity.rigidbody.applyTorque(0,-this.torque, 0);
                
            } else if (app.keyboard.isPressed(pc.KEY_RIGHT)) {
                
                this.entity.rigidbody.applyTorque(0,this.torque, 0);
                
            }
            
            if (app.keyboard.isPressed(pc.KEY_UP)) {
                
                this.entity.rigidbody.applyForce(0,0,this.thrust);
                
            } else if (app.keyboard.isPressed(pc.KEY_DOWN)) {
                
                this.entity.rigidbody.applyForce(0,0,-this.thrust);
                
            }           
        }
    };

    return Car_control;
});