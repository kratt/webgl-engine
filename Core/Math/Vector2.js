/**
 * @class Implementation of a two-dimensional vector.
 *
 * @author Julian Kratt
 */

Pixel.Core.Math.Vector2 = function(x, y)
{
    if(Pixel.Core.Math.Vector2.arguments.length < 2)
    {
        this.x = 0.0;
        this.y = 0.0;
    }
    else
    {
        this.x = x;
        this.y = y;
    }
    return this;
};

// shortcut
Pixel.vec2 = Pixel.Core.Math.Vector2;


Pixel.Core.Math.Vector2.prototype = {

    /**
     * Sets the values of the vector.
     * @param x First component of the vector.
     * @param y Second component of the vector.
     */
    set : function(x, y)
    {
        this.x = x;
        this.y = y;

        return this;
    },


    /**
     * Dot product.
     * @param vector
     */
   dot : function(vector)
   {
        return this.x*vector.x + this.y*vector.y;
   },


    /**
     * Normalizes the vector.
     * @returns {*}
     */
    normalize : function()
    {
        var len = this.length();

        if(len != 0.0)
        {
            this.x /= len;
            this.y /= len;

            return this;
        }
    },

    /**
     * Returns a normalized vector.
     * @returns {Pixel.Core.Math.Vector2}
     */
    normalized : function()
    {
        var len = this.length();
        var x = this.x / len;
        var y = this.y / len;

        return new Pixel.Core.Math.Vector2(x, y);
    },


    /**
     * Returns the length of the vector.
     */
    length : function()
    {
        return Math.sqrt(this.x*this.x + this.y*this.y);
    },


    /**
     * Returns the squared length of the vector.
     * @returns {string}
     */
    lengthSqrt : function()
    {
        return Number(this.x*this.x + this.y*this.y);
    } ,


    /**
     * Adds the given vector to the current one.
     * @param vector
     */
    add : function(vector)
    {
        var x = this.x;
        var y = this.y;

        x += vector.x;
        y += vector.y;

        return new Pixel.Core.Math.Vector2(x,y);
    },


    /**
     * Subtracts the vector from the current one.
     * @param vector
     */
    subtract : function(vector)
    {
        var x = this.x;
        var y = this.y;

        x -= vector.x;
        y -= vector.y;

        return new Pixel.Core.Math.Vector2(x,y);
    },


    /**
     * Multiplies the given vector with the value.
     * @param value
     */
    multiply : function(value)
    {
        var x = this.x;
        var y = this.y;

        x *= value;
        y *= value;

        return new Pixel.Core.Math.Vector2(x,y);
    },


    /**
     * Divides the current vector by the value.
     * @param value
     */
    divide : function(value)
    {
        var x = this.x;
        var y = this.y;

        x /= value;
        y /= value;

        return new Pixel.Core.Math.Vector2(x,y);
    },

    /**
     * Returns a string that contains the components of the vector.
     * @returns {string}
     */
    toString : function()
    {
        return "(" + this.x + ", " + this.y + ")";
    }
};

// shortcut
Pixel.vec2 = Pixel.Core.Math.Vector2;
Vector2    = Pixel.Core.Math.Vector2;
vec2       = Pixel.Core.Math.Vector2;

