pc.script.create('race_terrain', function (app) {
    // Creates a new Race_terrain instance
    var Race_terrain = function (entity) {
        this.entity = entity;
    };

    Race_terrain.prototype = {
        
        // Called once after all resources are loaded and before the first update
        initialize: function () {
            this.terrainCount = 1;
            
           var arenaBounds =  this.entity.findByName('ArenaBounds');
           arenaBounds.collision.on('triggerleave', this.onWallEnter, arenaBounds);
           
            
            for ( n = 1; n <= 6; n++ ){
                var beacon =  this.entity.findByName('Beacon'+n);
                beacon.id = n;
                beacon.collision.on('triggerenter', this.onBeacon, beacon);
                
                //var terrain = this.entity.findByName('DesertLandscape'+n);
                
            //    var leftWall =  this.entity.findByName('LeftWall'+n);
            //    leftWall.collision.on('triggerenter', this.onWallEnter, leftWall);
                
            //    var rightWall =  this.entity.findByName('RightWall'+n);
            //    rightWall.collision.on('triggerenter', this.onWallEnter, rightWall);                
            }
        },
        
        onBeacon: function (entity) {
            console.log('You got check point '+this.id+' ! ');
            this.destroy();
        },

        onWallEnter: function (entity) {
            // Reset back to middle of track, but still at the same distance!
            
            var position = entity.getPosition();
            
            if ( position.z < 0 ){
                position.z = 20;
            }
            if ( position.z > 800 ){
                position.z = 790;
            }
            
            entity.rigidbody.teleport(0,59,position.z,0,0,0);
            
            //var forceToMiddle = position.x*1000000;
            
            //entity.rigidbody.applyImpulse(forceToMiddle, 0, 0);
            console.log('You collided! Z: '+position.z);

            entity.rigidbody.linearVelocity = pc.Vec3.ZERO;
            entity.rigidbody.angularVelocity = pc.Vec3.ZERO;
            entity.rigidbody.syncEntityToBody();
        },
        
        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
         /*  if(app.keyboard.wasPressed(pc.KEY_SPACE)) {
                this.spawnTerrain(this.terrainCount);
                this.terrainCount++;
           }*/
        }
        /*
        spawnTerrain: function(nr){
            var terrain = this.entity.findByName('DesertLandscape');
            if (terrain){
                var copy = terrain.clone();
                copy.rigidbody.teleport(0, 0, nr*3*terrain.getLocalScale().z);
                var cylinder = copy.findByName('DesertCylinder');
                app.root.addChild(cylinder);
                app.root.addChild(t);
                
            }          
        }*/
    };
    return Race_terrain;
});