pc.script.attribute('maxDistance', 'number', 20, {
    displayName: 'Max Distance'
});

pc.script.attribute('minElevation', 'number', 5, {
    displayName: 'Min Elevation'
});

pc.script.attribute('maxElevation', 'number', 75, {
    displayName: 'Max Elevation'
});

pc.script.create('camera', function (app) {
    
    // Creates a new Camera instance
    var Camera = function (entity) {
        this.entity = entity;
        this.vehicle = null;
        this.desiredPos = new pc.Vec3();
        this.desiredPitch = 30;
        this.desiredYaw = 0;
        this.desiredDistance = 30;
        this.pitch = new pc.Quat();
        this.yaw = new pc.Quat();
        this.quat = new pc.Quat();
    };

    Camera.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
            this.vehicle = app.root.findByName('Buggy');
            app.mouse.on('mousemove', this.onMouseMove, this);
            app.mouse.on('mousewheel', this.onMouseWheel, this);
        },

        // Called every frame, after 'update' method
        postUpdate: function (dt) {
            var vehiclePos = this.vehicle.getPosition();
            
            // calculate desired position
            var forward = this.vehicle.forward;
            forward.y = 0;
            forward.normalize();
            
            this.pitch.setFromAxisAngle(this.entity.right, -this.desiredPitch);
            this.yaw.setFromAxisAngle(pc.Vec3.UP, this.desiredYaw);
            this.quat.mul2(this.pitch, this.yaw).transformVector(forward, forward);
            
            this.desiredPos.add2(vehiclePos, forward.scale(this.desiredDistance));
            
            // smoothly position camera towards desired position
            var pos = this.entity.getPosition();
            pos.lerp(pos, this.desiredPos, dt*10);
            this.entity.setPosition(pos);
            
            // always look at vehicle
            this.entity.lookAt(vehiclePos);
        },
        
        onMouseMove: function (e) {
            if (e.buttons[pc.MOUSEBUTTON_LEFT]) {
                
                this.desiredPitch += e.dy * 0.1;
                if (this.desiredPitch > 360) {
                    this.desiredPitch -= 360;
                } else if (this.desiredPitch < 0) {
                    this.desiredPitch += 360;
                }
                
                this.desiredPitch = pc.math.clamp(this.desiredPitch, this.minElevation, this.maxElevation);
                
                this.desiredYaw -= e.dx * 0.1;
                if (this.desiredYaw > 360) {
                    this.desiredYw -= 360;
                } else if (this.desiredYaw < 0) {
                    this.desiredYaw += 360;
                }
            }
        },
        
        onMouseWheel: function (e) {
            this.desiredDistance = pc.math.clamp(this.desiredDistance - e.wheel, 0.1, this.maxDistance);
        }
    };

    return Camera;
});