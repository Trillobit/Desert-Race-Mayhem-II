pc.script.create('todo', function (app) {
    // Creates a new Todo instance
    var Todo = function (entity) {
        this.entity = entity;
    };

    Todo.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
            /*
                #Desert Race Mayhem - project plan
                - Idea: Desert Race. A goal is created forward on the map. 
                7 AI's also race for it when 4 cars has reach the goal
                the round is over, or if 4+ are broken.
                
                First: 5p
                Second: 3p
                Third: 2p
                Fourth: 1p
                
                Goal is to WIN the tournament!
                
                Everyone gets $700 to spend Level. No money left over!
                
                For next round you can equip your car.
                
                * Rockets - $250 for 5 - Fire at opponents
                * Booster - $150 for 3 - Impulse jump ahead
                * Repell  - $300 for 7 - Auto push others away on impact
                * Spikes  - $300 for 7 - Damage others more on impact
                
                Implement car armor and make cars smoke when damaged. 
                
                ## Implementation:
                1. Add a 3 "terrains" after eachother in code
                2. Add security bounds and kill if you go to much left or right (or back).
                (3. If car starts to fall trough terrain - kill it.)
                4. if cars turnsover - swap it back over.
                5. Create a goal at a random spot in the "Terrain"
                6. Once player reach 3rd goal or dies - next round.

                7. End of round and new Round 
                    - Show your time and Round number
                    - Show a list of "competitors" and their placings (random for now) 
                       - Show tournament final score after 3? rounds - and your placement!
                       - Reward a title depending on your placement
                       - Button to retry
                    - Respawn 3 terrains and scale them up a little bit
                    - Respawn 3 goals, 1 in each terrain
                    - Respawn at Terrain 1
                    - Show text "Round X"
                    - Show count down 5, 4, 3, 2, 1
                    
                8. Add AI opponents
                    - Same buggy model, color their cars
                    - Write AI, go straight towards point on map
                    - Spawn a bunch of AI together with player
                    - Let score board use these "real" AI players
                    - Add physics to AI cars
                    - Maybe add some swarm/boid behavior to AI cars
                    - Maybe add some randomness to AI waypoints so they
                    don't always drive the closest way only..
                
                9. Polish
                    - Add sound
                    - Add music
                    - Add skybox
                    - Add random desert props?
                    - Add mud/water level for the deepest pots (maybe make it affect the cars?)
                    - Add sand particles to the air
                    
                10. Add IAP 
                    - Shop after each round
                    - Add more items to shop each round!
                    - Add permanent items to shop (always +1 rocket)
                    - Let AI's buy things in shop too
                
                11. Add Obstacles
                    - At higher rounds, generate obstacles
                    - Mines that can explode
                    - Walls to dodge (they break on impact)
                    - Jumps for stunts
                    - Gigantic car eating SAND WORMS!!!! (Yeah right, like I'm going to get this far...)
                
                12. Add Multiplayer
                    - Should be simple enough
                    - Just do it
                    - And then be happy
                    - Make sure it works on "all" platforms
                    - I'm being half serious here
                    - Just push people into an open game
                    - If more than (so many that it lags) then create new game :)
                
                13. Publish game with IAP for money 
                    (allow players to use IAP to buy discounts that FOREVER lowers the price on the items in game)
                    1. Publish on Html 5 sites
                    2. Publish on Android
                    3. Publish on iOS
                    4. Maybe Publish on additional platforms
                    
                ## Art required @ polish checkpoint
                - Skybox (8 textures desert sky + sun)
                - Cool desert items just for visual effect
                - Sand dust particle 
                
                ## Sound required @ polish checkpoint
                - Engine idle
                - Engine alive
                - Crash into another car sound
                - Checkpoint beep
                - Round end song
                Wishlist: Countdown commentator
                
                ## Art required @ IAP checkpoint
                1. Rocket Icon
                2. Jumpboost Icon
                3. Repell Icon
                4. Rocket model
                5. Rocket explosion particle effects
                
                ## Sound required @ IAP checkpoint
                - Rocket fire
                - Rocket explode
                - Jumpboost Use
                - Repell Use
                - Buy item
                
                ## Art required @ IAP obstacles
                - Mines
                - Random objects
                - Sand Worm model (lol)
                
                
                
            */
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
        }
    };

    return Todo;
});