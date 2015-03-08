// Script Attributes

// top vehicle speed
pc.script.attribute('topSpeed', 'number', 10, {
    displayName: 'Top Speed'
}); 

// used to accelerate the vehicle
pc.script.attribute('maxEngineForce', 'number', 1000, {
    displayName: 'Max Engine Force'
}); 

// used for braking
pc.script.attribute('maxBrakingForce', 'number', 30, {
    displayName: 'Max Braking Force'
}); 

// used for steering
pc.script.attribute('maxSteering', 'number', 0.2, {
    displayName: 'Max Steering'
}); 

// Wheel parameters
pc.script.attribute('suspensionStiffness', 'number', 20, {
    displayName: 'Suspension Stiffness'
});

pc.script.attribute('suspensionDamping', 'number', 2.3, {
    displayName: 'Suspension Damping'
});

pc.script.attribute('suspensionCompression', 'number', 4.4, {
    displayName: 'Suspension Compression'
});

pc.script.attribute('suspensionRestLength', 'number', 0.6, {
    displayName: 'Suspension Rest Length'
});

pc.script.attribute('rollInfluence', 'number', 2, {
    displayName: 'Roll Influence'
});

pc.script.attribute('friction', 'number', 1000, {
    displayName: 'Friction Slip'
});

// Script Declaration
pc.script.create('vehicle', function (app) {

    var ammoVec = new Ammo.btVector3();

    // set to true to see debug shapes for the vehicle
    var DEBUG_DRAW = false;

    var wheelDirection = new Ammo.btVector3(0, -1, 0);
    var wheelAxle = new Ammo.btVector3(-1, 0, 0);
    
    var wheelRadius = 0.4;
    
    var wheelsConfig = [{
        isFront: true,
        connection: [0.88, 0.8, 1.2],
        radius: wheelRadius,
        width: 0.4,
        name: 'FR_Wheel' 
    },
    {
        isFront: true,
        connection: [-0.88, 0.8, 1.2],
        radius: wheelRadius,
        width: 0.4,
        name: 'FL_Wheel'
    },
    {
        isFront: false,
        connection: [-0.88, 0.8, -1.2],
        radius: wheelRadius,
        width: 0.4,
        name: 'BL_Wheel'
    },
    {
        isFront: false,
        connection: [0.88, 0.8, -1.2],
        radius: wheelRadius,
        width: 0.4,
        name: 'BR_Wheel'
    }];
    
    // Creates a rigid body ands adds it to the physics world
    function localCreateRigidBody(mass, transform, shape) {
        var localInertia = new Ammo.btVector3(0, 0, 0);
        if (mass > 0) {
            shape.calculateLocalInertia(mass, localInertia);
        }

        var motionState = new Ammo.btDefaultMotionState(transform);
        var bodyInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, shape, localInertia);
        var body = new Ammo.btRigidBody(bodyInfo);
        body.setContactProcessingThreshold(1000000.0);
        app.systems.rigidbody.dynamicsWorld.addRigidBody(body);
        return body;
    }
    
    var Vehicle = function (entity) {
        this.entity = entity;

        this.engineForce = 0.0;
        this.brakingForce = 0.0;

        this.vehicleSteering = 0.0;
        
        this.debug = {
            chassis: null,
            wheels: []
        };

        this.graphics = {
            chassis: null,
            wheels: []
        };

        this.trans = new Ammo.btTransform();
        this.quat = new pc.Quat();
        this.pos = new pc.Vec3();
        this.mat = new pc.Mat4();

        this.initialRot = this.entity.getRotation().clone();
        this.initialPos = this.entity.getPosition().clone();
        this.direction = new pc.Vec3();
            
        this.controls = false;
    };

    Vehicle.prototype = {
        // Initialize the vehicle
        initialize: function () {
            var i;
            
            // Create box for chassis
            var chassisShape = new Ammo.btBoxShape(new Ammo.btVector3(0.7, 0.5, 1.0));
            
            // Create compound shape that will contain the chassis shape.
            // We use a compound shape to shift the center of mass with respect to the chassis
            // localTrans effectively shifts the center of mass
            var localTrans = new Ammo.btTransform();
            localTrans.setIdentity();
            localTrans.setOrigin(new Ammo.btVector3(0, 1, 0));
            
            var compound = new Ammo.btCompoundShape();
            compound.addChildShape(localTrans, chassisShape);

            // create rigid body for the chassis and position it 
            // at the location of this entity
            var tr = new Ammo.btTransform();
            tr.setIdentity();
            var p = this.entity.getPosition();
            tr.setOrigin(new Ammo.btVector3(p.x, p.y, p.z));
            this.carChassis = localCreateRigidBody(100, tr, compound);
            this.carChassis.entity = this.entity;

            // Create vehicle
            var tuning = new Ammo.btVehicleTuning();
            var vehicleRayCaster = new Ammo.btDefaultVehicleRaycaster(app.systems.rigidbody.dynamicsWorld);
            this.vehicle = new Ammo.btRaycastVehicle(tuning, this.carChassis, vehicleRayCaster);

            // Never deactivate the vehicle
            this.carChassis.setActivationState(pc.RIGIDBODY_DISABLE_DEACTIVATION);

            // Add the vehicle to the dynamics world
            app.systems.rigidbody.dynamicsWorld.addAction(this.vehicle);

            // Choose coordinate system
            var rightIndex = 0; 
            var upIndex = 1; 
            var forwardIndex = 2;
            this.vehicle.setCoordinateSystem(rightIndex, upIndex, forwardIndex);

            // Add wheels to the vehicle
            var name = this.entity.getName();
            var numWheels = wheelsConfig.length;
            
            for (i = 0; i < numWheels; i++) {
                var wheel = wheelsConfig[i];
                var connectionPoint = new Ammo.btVector3(wheel.connection[0], wheel.connection[1], wheel.connection[2]);
                this.vehicle.addWheel(connectionPoint, wheelDirection, wheelAxle, this.suspensionRestLength, wheel.radius, tuning, wheel.isFront);
            }

            // Set wheel params
            for (i = 0; i < this.vehicle.getNumWheels(); i++) {
                var wheel = this.vehicle.getWheelInfo(i);
                wheel.set_m_suspensionStiffness(this.suspensionStiffness);
                wheel.set_m_wheelsDampingRelaxation(this.suspensionDamping);
                wheel.set_m_wheelsDampingCompression(this.suspensionCompression);
                wheel.set_m_frictionSlip(this.friction);
                wheel.set_m_rollInfluence(this.rollInfluence);
            }
            
            // Find the actual chassis and wheel models 
            this.graphics.chassis = this.entity.findByName('ARM_Buggy');
            for (i = 0; i < this.vehicle.getNumWheels(); i++) {
                this.graphics.wheels[i] = this.entity.findByName(wheelsConfig[i].name);
            }

            // Create the debug graphics for the car
            if (DEBUG_DRAW) {
                var e = new pc.Entity();
                e.setLocalScale(1.4, 1, 3.2);
                app.root.addChild(e);
                e.addComponent('model', {
                    type: 'box',
                    castShadows: true
                });
                
                this.debug.chassis = e;
                
                for (i = 0; i < this.vehicle.getNumWheels(); i++) {
                    var wheel = wheelsConfig[i];
                    
                    p = new pc.Entity();
                    app.root.addChild(p);
                    this.debug.wheels.push(p);
    
                    e = new pc.Entity();
                    e.setLocalEulerAngles(0, 0, 90);
                    e.setLocalScale(wheel.radius / 0.5, wheel.width, wheel.radius / 0.5);
                    p.addChild(e);
                    e.addComponent('model', {
                        type: 'cylinder',
                        castShadows: true
                    });
                }
            }
        },

        // Resets the vehicle to its initial position
        reset: function () {
            var body = this.carChassis;
            var transform = body.getWorldTransform();
            transform.setOrigin(new Ammo.btVector3(this.initialPos.x, this.initialPos.y, this.initialPos.z));
            transform.setRotation(new Ammo.btQuaternion(this.initialRot.x, this.initialRot.y, this.initialRot.z, this.initialRot.w));
            body.setLinearVelocity(new Ammo.btVector3(0, 0, 0));
            body.setAngularVelocity(new Ammo.btVector3(0, 0, 0));
        },

        // Called when the vehicle is enabled
        onEnable: function () {
            this.controls = true;
        },

        // Called when the vehicle is disabled
        onDisable: function () {
            this.controls = false;
        },

        // Called when an attribute changes value in the Designer
        onAttributeChanged: function (name, oldValue, newValue) {
            if (this.vehicle) {
                // reset parameters on all wheels
                for (var i = 0; i < this.vehicle.getNumWheels(); i++) {
                    var wheel = this.vehicle.getWheelInfo(i);
                    wheel.set_m_suspensionStiffness(this.suspensionStiffness);
                    wheel.set_m_wheelsDampingRelaxation(this.suspensionDamping);
                    wheel.set_m_wheelsDampingCompression(this.suspensionCompression);
                    wheel.set_m_frictionSlip(this.friction);
                    wheel.set_m_rollInfluence(this.rollInfluence);
                    this.vehicle.updateWheelTransform(i, false);
                }
            }

        },
        
        // Called every frame
        update: function (dt) {
            var i;
            
            // Reset the vehicle if R is pressed
            if (app.keyboard.wasPressed(pc.KEY_R)) {
                this.reset();
            }

            // Limit vehicle velocity
            var maxVehicleSpeed = this.topSpeed;
            var spd = this.vehicle.getRigidBody().getLinearVelocity();
            if (spd.length() > maxVehicleSpeed) {
                var divisor = Math.abs(spd.length() / maxVehicleSpeed);
                ammoVec.setValue(spd.x() / divisor, spd.y() / divisor, spd.z() / divisor);
                this.vehicle.getRigidBody().setLinearVelocity(ammoVec);
            }
            
            this.direction.set(spd.x(), spd.y(), spd.z()).normalize();

            // Get user input
            var left = false;
            var right = false;
            var up = false;
            var down = false;

            if (this.controls) {
                left = app.keyboard.isPressed(pc.KEY_A);
                right = app.keyboard.isPressed(pc.KEY_D);
                up = app.keyboard.isPressed(pc.KEY_W);
                down = app.keyboard.isPressed(pc.KEY_S);
            }

            if (left && right) {
                this.vehicleSteering = 0;
            } else if (left) {
                this.vehicleSteering = this.maxSteering;
            } else if (right) {
                this.vehicleSteering = -this.maxSteering;
            } else {
                this.vehicleSteering = 0;
            }

            if (up && down) {
                this.engineForce = this.brakingForce = 0;
            } else if (up) {
                // if we are moving backwards then apply brake 
                // otherwise apply engine force
                if (this.direction.dot(this.entity.forward) > 0) {
                    this.brakingForce = this.maxBrakingForce;
                    this.engineForce = 0;
                } else {
                    this.brakingForce = 0;
                    this.engineForce = this.maxEngineForce;
                }
            } else if (down) {
                // if we are moving forward then apply brake 
                // otherwise apply opposite engine force
                if (this.direction.dot(this.entity.forward) < 0) {
                    this.brakingForce = this.maxBrakingForce;
                    this.engineForce = 0;
                } else {
                    this.brakingForce = 0;
                    this.engineForce = -this.maxEngineForce;
                }
                
            } else {
                this.engineForce = this.brakingForce = 0;
            }

            // Apply engine and braking force to the back wheels
            this.vehicle.applyEngineForce(this.engineForce, 0);
            this.vehicle.setBrake(this.brakingForce, 0);
            this.vehicle.applyEngineForce(this.engineForce, 1);
            this.vehicle.setBrake(this.brakingForce, 1);
            
            // Apply steering to the front wheels
            this.vehicle.setSteeringValue(this.vehicleSteering, 0);
            this.vehicle.setSteeringValue(this.vehicleSteering, 1);
            
            for (i = 0; i < this.vehicle.getNumWheels(); i++) {
                // synchronize the wheels with the (interpolated) chassis worldtransform
                this.vehicle.updateWheelTransform(i, true);
            }

            // Get world transform of the chassis from the physics engine
            this.carChassis.getMotionState().getWorldTransform(this.trans);
            var t = this.trans;

            var p = t.getOrigin();
            var q = t.getRotation();
            this.quat.set(q.x(), q.y(), q.z(), q.w());

            // position debug shapes
            if (DEBUG_DRAW) {
                this.debug.chassis.setPosition(p.x(), p.y() + 1, p.z());
                this.debug.chassis.setRotation(this.quat);
            }
            
            // position chassis model
            this.entity.setPosition(p.x(), p.y(), p.z());
            this.entity.setRotation(this.quat);
            this.graphics.chassis.setPosition(p.x(), p.y(), p.z());
            
            // get chassis world transform we will use it to correct
            // the wheel positions
            this.mat.copy(this.graphics.chassis.getWorldTransform());
            this.mat.invert();

            for (i = 0; i < this.vehicle.getNumWheels(); i++) {
                t = this.vehicle.getWheelTransformWS(i);

                p = t.getOrigin();
                q = t.getRotation();
                
                this.pos.set(p.x(), p.y(), p.z());
                this.quat.set(q.x(), q.y(), q.z(), q.w());
                
                // convert world position to local position
                this.mat.transformPoint(this.pos, this.pos);
                // bring the wheel models a little further in
                this.pos.x *= 0.9;
                
                // position wheel models
                this.graphics.wheels[i].setLocalPosition(this.pos);
                this.graphics.wheels[i].setRotation(this.quat);
                
                // position wheel debug shapes
                if (DEBUG_DRAW) {
                    this.debug.wheels[i].setPosition(p.x(), p.y(), p.z());
                    this.debug.wheels[i].setRotation(this.quat);
                }
            }
        }
    };

    return Vehicle;
});