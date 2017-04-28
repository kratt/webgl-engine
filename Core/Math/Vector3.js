/**
 * @class Implementation of a three-dimensional vector.
 *
 * @author Julian Kratt
 */

Pixel.Core.Math.Vector3 = function(x, y, z)
{
    if(Pixel.Core.Math.Vector3.arguments.length < 3)
    {
        this.x = 0.0;
        this.y = 0.0;
        this.z = 0.0;
    }
    else
    {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    return this;
};

// shortcut
Pixel.vec3 = Pixel.Core.Math.Vector3;
Vector3    = Pixel.Core.Math.Vector3;
vec3       = Pixel.Core.Math.Vector3;


Pixel.Core.Math.Vector3.prototype = {

    /**
     * Sets the values of the vector.
     * @param x First component of the vector.
     * @param y Second component of the vector.
     * @param z Third component of the vector.
     */
    set : function(x, y, z)
    {
        this.x = x;
        this.y = y;
        this.z = z;

        return this;
    },


    /**
     * Dot product.
     * @param vector
     */
       dot : function(vector)
       {
            return this.x*vector.x + this.y*vector.y + this.z*vector.z;
       },


    /**
     * Cross product.
     * @param vector
     * @returns {*}
     */
    cross: function(vector) {

        var x = this.x;
        var y = this.y;
        var z = this.z;

        x = this.y * vector.z - this.z * vector.y;
        y = this.z * vector.x - this.x * vector.z;
        z = this.x * vector.y - this.y * vector.x;

        return new Pixel.Core.Math.Vector3(x,y,z);
    },


    /**
     * Returns the angle between the current and the given vector.
     */
    angle : function(vector)
    {
        var d = this.dot(vector);
        var a = this.length();
        var b = vector.length();

        var s = d / (a*b);

        if(s>1) s = 1.0;
        if(s<-1) s= -1.0;

        return Math.acos(s);
    },


    /**
     * Normalizes the vector.
     * @returns {*}
     */
    normalize : function()
    {
        var len = this.length();
        this.x /= len;
        this.y /= len;
        this.z /= len;

        return this;
    },

    /**
     * Returns a normalized vector.
     * @returns {Pixel.Core.Math.Vector3}
     */
    normalized : function()
    {
        var len = this.length();
        var x = this.x / len;
        var y = this.y / len;
        var z = this.z / len;

        return new Pixel.Core.Math.Vector3(x, y, z);
    },


    /**
     * Returns the length of the vector.
     */
    length : function()
    {
        return Math.sqrt(this.x*this.x + this.y*this.y + this.z*this.z);
    },


    /**
     * Returns the squared length of the vector.
     * @returns {string}
     */
    lengthSqrt : function()
    {
        return this.x*this.x + this.y*this.y + this.z*this.z;
    } ,


    /**
     * Adds the given vector to the current one.
     * @param vector
     */
     add : function(vector)
     {
         var x = this.x;
         var y = this.y;
         var z = this.z;

         x += vector.x;
         y += vector.y;
         z += vector.z;

         return new Pixel.Core.Math.Vector3(x,y,z);
     },


    /**
     * Subtracts the vector from the current one.
     * @param vector
     */
     subtract : function(vector)
     {
         var x = this.x;
         var y = this.y;
         var z = this.z;

         x -= vector.x;
         y -= vector.y;
         z -= vector.z;

         return new Pixel.Core.Math.Vector3(x,y,z);
     },


    /**
     * Multiplies the given vector with the value.
     * @param value
     */
    multiply : function(value)
    {
        var x = this.x;
        var y = this.y;
        var z = this.z;

        x *= value;
        y *= value;
        z *= value;

        return new Pixel.Core.Math.Vector3(x,y,z);
    },


    /**
     * Divides the current vector by the value.
     * @param value
     */
    divide : function(value)
    {
        var x = this.x;
        var y = this.y;
        var z = this.z;

        x /= value;
        y /= value;
        z /= value;

        return new Pixel.Core.Math.Vector3(x,y,z);
    },


    /**
     * Returns a string that contains the components of the vector.
     * @returns {string}
     */
    toString : function()
    {
        return "(" + this.x + ", " + this.y + ", " + this.z + ")";
    }
};


