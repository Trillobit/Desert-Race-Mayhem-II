pc.script.attribute('maxDistance', 'number', 20, {
    displayName: 'Max Distance'
});

pc.script.attribute('minElevation', 'number', 5, {
    displayName: 'Min Elevation'
});

pc.script.attribute('maxElevation', 'number', 75, {
    displayName: 'Max Elevation'
});

pc.script.attribute('desiredDistance', 'number', 5, {
    displayName: 'Forward Position'
});

pc.script.attribute('desiredPitch', 'number', 1, {
    displayName: 'Up Position'
});



pc.script.create('camera', function (app) {
    
    // Creates a new Camera instance
    var Camera = function (entity) {
        this.entity = entity;
        this.vehicle = null;
        this.desiredPos = new pc.Vec3();
        this.cameraLocation = new pc.Vec3();
        this.cameraLookAt = new pc.Vec3();
        this.cameraLookAtAim = new pc.Vec3();
        //this.desiredPitch = 30;
        this.desiredYaw = 0;
        //this.desiredDistance = 30;
        this.pitch = new pc.Quat();
        this.yaw = new pc.Quat();
        this.quat = new pc.Quat();
    };

// First person mode:
// Desired Distance (forward) = 0.4
// Desired Pitch (up) = 1

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
            //forward.y = 0;
            forward.normalize();
            forward.scale(this.desiredDistance);
            var up = this.vehicle.up;
            up.normalize();
            up.scale(this.desiredPitch);
            
            this.cameraLocation.set(0,0,0);
            this.cameraLocation.add(vehiclePos);
            this.cameraLocation.add(forward);
            this.cameraLocation.add(up);
            //this.entity.setPosition(this.cameraLocation);
            
            /*this.pitch.setFromAxisAngle(this.entity.right, -this.desiredPitch);
            this.yaw.setFromAxisAngle(pc.Vec3.UP, this.desiredYaw);
            this.quat.mul2(this.pitch, this.yaw).transformVector(forward, forward);
            */
            //this.desiredPos.add2(vehiclePos, forward.scale(this.desiredDistance));
            
            // smoothly position camera towards desired position
            var pos = this.entity.getPosition();
            pos.lerp(pos, this.cameraLocation, dt*2);
            this.entity.setPosition(pos);
            
            var forward2 = this.vehicle.forward;
            forward2.normalize();
            forward2.scale(-30);
            var up2 = this.vehicle.up;
            up2.normalize();
            up2.scale(5);
            this.cameraLookAt.set(0,0,0);
            this.cameraLookAt.add(vehiclePos);
            this.cameraLookAt.add(forward2);
            this.cameraLookAt.add(up2);
            // always look at vehicle
            
            var pos2 = this.cameraLookAtAim;
            pos2.lerp(pos2, this.cameraLookAt, dt*2);
            this.entity.lookAt(pos2);
            this.cameraLookAtAim = pos2;
            //this.entity.forward = forward;
        },
        
        onMouseMove: function (e) {
            /*if (e.buttons[pc.MOUSEBUTTON_LEFT]) {
                
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
            }*/
        },
        
        onMouseWheel: function (e) {
            /*this.desiredDistance = pc.math.clamp(this.desiredDistance - e.wheel, 0.1, this.maxDistance);*/
        }
    };

    return Camera;
});