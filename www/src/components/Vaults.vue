<template>
  <div class="vaults">

  <router-link :to="{name: 'Vault', params: {vaultId: vault._id}}" class="btn-liquid"> 
      <span class="inner montserrat-thick">{{ vault.name }}&nbsp;&nbsp;/<v-btn icon small class="mb-2" @click.prevent="removeVault(vault._id)"><v-icon>delete_forever</v-icon></v-btn></span>
      <canvas :id="vault._id"></canvas>
  </router-link>


  </div>
</template>

<script>
  import $ from 'jquery'

  export default {
    name: 'vault',
    props: [
      'vault'
    ],
    data() {
      return {
        pointsA: [],
        pointsB: [],
        $canvas: null,
        canvas: null,
        context: null,
        points: 8,
        viscosity: 20,
        mouseDist: 70,
        damping: 0.05,
        showIndicators: false,
        mouseX: 0,
        mouseY: 0,
        relMouseX: 0,
        relMouseY: 0,
        mouseLastX: 0,
        mouseLastY: 0,
        mouseDirectionX: 0,
        mouseDirectionY: 0,
        mouseSpeedX: 0,
        mouseSpeedY: 0,
        Point: function (x, y, level, _this) {
          this.x = this.ix = 50 + x;
          this.y = this.iy = 50 + y;
          this.vx = 0;
          this.vy = 0;
          this.cx1 = 0;
          this.cy1 = 0;
          this.cx2 = 0;
          this.cy2 = 0;
          this.level = level;
          this._this = _this;

          this.move = function () {
            // console.log('this point', this);
            this.vx += (this.ix - this.x) / (_this.viscosity * this.level);
            this.vy += (this.iy - this.y) / (_this.viscosity * this.level);

            var dx = this.ix - _this.relMouseX,
              dy = this.iy - _this.relMouseY;
            var relDist = (1 - Math.sqrt((dx * dx) + (dy * dy)) / _this.mouseDist);

            // Move x
            if ((_this.mouseDirectionX > 0 && _this.relMouseX > this.x) || (_this.mouseDirectionX < 0 && _this.relMouseX < this.x)) {
              if (relDist > 0 && relDist < 1) {
                this.vx = (_this.mouseSpeedX / 4) * relDist;
              }
            }
            this.vx *= (1 - _this.damping);
            this.x += this.vx;

            // Move y
            if ((_this.mouseDirectionY > 0 && _this.relMouseY > this.y) || (_this.mouseDirectionY < 0 && _this.relMouseY < this.y)) {
              if (relDist > 0 && relDist < 1) {
                this.vy = (_this.mouseSpeedY / 4) * relDist;
              }
            }
            this.vy *= (1 - _this.damping);
            this.y += this.vy;
          };
        }
      }
    },
    methods: {
      mouseDirection(e) {
        if (this.mouseX < e.pageX)
          this.mouseDirectionX = 1;
        else if (this.mouseX > e.pageX)
          this.mouseDirectionX = -1;
        else
          this.mouseDirectionX = 0;

        if (this.mouseY < e.pageY)
          this.mouseDirectionY = 1;
        else if (this.mouseY > e.pageY)
          this.mouseDirectionY = -1;
        else
          this.mouseDirectionY = 0;

        this.mouseX = e.pageX;
        this.mouseY = e.pageY;

        this.relMouseX = (this.mouseX - this.$canvas.offset().left);
        this.relMouseY = (this.mouseY - this.$canvas.offset().top);
      },
      mouseSpeed() {
        this.mouseSpeedX = this.mouseX - this.mouseLastX;
        this.mouseSpeedY = this.mouseY - this.mouseLastY;

        this.mouseLastX = this.mouseX;
        this.mouseLastY = this.mouseY;

        setTimeout(this.mouseSpeed, 50);
      },
      initButton() {
        // Get button
        var button = $('.btn-liquid');
        var buttonWidth = button.width();
        var buttonHeight = button.height();

        // Create canvas
        this.$canvas = $('#' + this.vault._id);
        // button.append(this.$canvas);

        this.canvas = this.$canvas.get(0);
        this.canvas.width = buttonWidth + 100;
        this.canvas.height = buttonHeight + 100;
        this.context = this.canvas.getContext('2d');

        // Add this.points

        var x = buttonHeight / 2;
        for (var j = 1; j < this.points; j++) {
          this.addPoints((x + ((buttonWidth - buttonHeight) / this.points) * j), 0);
        }
        this.addPoints(buttonWidth - buttonHeight / 5, 0);
        this.addPoints(buttonWidth + buttonHeight / 10, buttonHeight / 2);
        this.addPoints(buttonWidth - buttonHeight / 5, buttonHeight);
        for (var j = this.points - 1; j > 0; j--) {
          this.addPoints((x + ((buttonWidth - buttonHeight) / this.points) * j), buttonHeight);
        }
        this.addPoints(buttonHeight / 5, buttonHeight);

        this.addPoints(-buttonHeight / 10, buttonHeight / 2);
        this.addPoints(buttonHeight / 5, 0);
        // this.addPoints(x, 0);
        // this.addPoints(0, buttonHeight/2);

        // this.addPoints(0, buttonHeight/2);
        // this.addPoints(buttonHeight/4, 0);

        // Start render
        this.renderCanvas();
      },
      addPoints(x, y) {
        this.pointsA.push(new this.Point(x, y, 1, this));
        this.pointsB.push(new this.Point(x, y, 2, this));
      },
      renderCanvas() {
        // rAF
        var rafID = requestAnimationFrame(this.renderCanvas);

        // Clear scene
        this.context.clearRect(0, 0, this.$canvas.width(), this.$canvas.height());
        this.context.fillStyle = 'transparent';
        this.context.fillRect(0, 0, this.$canvas.width(), this.$canvas.height());

        // Move this.points
        // console.log(this.pointsA);
        for (var i = 0; i <= this.pointsA.length - 1; i++) {
          this.pointsA[i].move();
          this.pointsB[i].move();
        }

        // Create dynamic gradient
        // var gradientX = Math.min(Math.max(this.mouseX - this.$canvas.offset().left, 0), this.$canvas.width());
        // var gradientY = Math.min(Math.max(this.mouseY - this.$canvas.offset().top, 0), this.$canvas.height());
        // var distance = Math.sqrt(Math.pow(gradientX - this.$canvas.width() / 2, 2) + Math.pow(gradientY - this.$canvas.height() / 2, 2)) / Math.sqrt(Math.pow(this.$canvas.width() / 2, 2) + Math.pow(this.$canvas.height() / 2, 2));

        var gradient = this.context.createRadialGradient(20, 200, 300, 200, 200, 0);
        gradient.addColorStop(0, '#7c4dff');
        gradient.addColorStop(1, '#E406D6');

        // Draw shapes
        var groups = [this.pointsA, this.pointsB]

        for (var j = 0; j <= 1; j++) {
          var points = groups[j];

          if (j == 0) {
            // Background style
            this.context.fillStyle = '#1CE2D8';
          } else {
            // Foreground style
            this.context.fillStyle = gradient;
          }

          this.context.beginPath();
          this.context.moveTo(points[0].x, points[0].y);

          for (var i = 0; i < points.length; i++) {
            var p = points[i];
            var nextP = points[i + 1];
            var val = 30 * 0.552284749831;

            if (nextP != undefined) {


              p.cx1 = (p.x + nextP.x) / 2;
              p.cy1 = (p.y + nextP.y) / 2;
              p.cx2 = (p.x + nextP.x) / 2;
              p.cy2 = (p.y + nextP.y) / 2;

              this.context.bezierCurveTo(p.x, p.y, p.cx1, p.cy1, p.cx1, p.cy1);

            } else {
              nextP = points[0];
              p.cx1 = (p.x + nextP.x) / 2;
              p.cy1 = (p.y + nextP.y) / 2;

              this.context.bezierCurveTo(p.x, p.y, p.cx1, p.cy1, p.cx1, p.cy1);
            }
          }

          // this.context.closePath();
          this.context.fill();
        }

        if (this.showIndicators) {
          // Draw points
          this.context.fillStyle = '#000';
          this.context.beginPath();
          for (var i = 0; i < this.pointsA.length; i++) {
            var p = this.pointsA[i];

            this.context.rect(p.x - 1, p.y - 1, 2, 2);
          }
          this.context.fill();

          // Draw controls
          this.context.fillStyle = '#f00';
          this.context.beginPath();
          for (var i = 0; i < this.pointsA.length; i++) {
            var p = this.pointsA[i];

            this.context.rect(p.cx1 - 1, p.cy1 - 1, 2, 2);
            this.context.rect(p.cx2 - 1, p.cy2 - 1, 2, 2);
          }
          this.context.fill();
        }
      },
      removeVault(vault) {
        this.$store.dispatch('removeVault', vault)
      }
    },
    mounted() {
      // Init
      $(document).on('mousemove', this.mouseDirection);
      this.mouseSpeed();
      this.initButton();
    },
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  body {
    /* display: flex; */
    height: 100%;

    align-items: center;
    justify-content: center;
  }

  canvas {
    background: transparent !important;
  }

  .btn-liquid {
    display: inline-block;
    position: relative;
    width: 280px;
    height: 50px;

    border-radius: 27px;

    color: #fff;
    font: 700 14px/60px "Droid Sans", sans-serif;
    letter-spacing: 0.05em;
    text-align: center;
    text-decoration: none;
    text-transform: uppercase;
  }

  .btn-liquid .inner {
    position: absolute;
    width: 100%;
    left: 0;
    z-index: 2;
  }

  .btn-liquid canvas {
    position: absolute;
    top: -50px;
    right: -50px;
    bottom: -50px;
    left: -40px;

    z-index: 1;
  }

  .montserrat-thick {
    font-family: 'Montserrat', sans-serif;
    font-style: 900;
  }
</style>