/**
 * @class Implementation of a four-dimensional vector.
 *
 * @author Julian Kratt
 */

Pixel.Core.Math.Vector4 = function(x, y, z, w)
{
    if(Pixel.Core.Math.Vector3.arguments.length < 4)
    {
        this.x = 0.0;
        this.y = 0.0;
        this.z = 0.0;
        this.w = 0.0;
    }
    else
    {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }
    return this;
};

// shortcut
Pixel.vec4 = Pixel.Core.Math.Vector4;


Pixel.Core.Math.Vector4.prototype = {

    /**
     * Sets the values of the vector.
     * @param x First component of the vector.
     * @param y Second component of the vector.
     * @param z Third component of the vector.
     * @param w Fourth component of the vector.
     */
    set : function(x, y, z, w)
    {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;

        return this;
    },


    /**
     * Dot product.
     * @param vector
     */
       dot : function(vector)
       {
            return this.x*vector.x + this.y*vector.y + this.z*vector.z + this.w*vector.w;
       },


    /**
     * Cross product.
     * @param vector
     * @returns {*}
     */
    cross: function(vector) {

       var x = this.y * vector.z - this.z * vector.y;
       var y = this.z * vector.x - this.x * vector.z;
       var z = this.x * vector.y - this.y * vector.x;

        return new Pixel.Core.Math.Vector4(x,y,z, 1.0);
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
        this.w /= len;

        return this;
    },


    /**
     * Returns a normalized vector.
     * @returns {Pixel.Core.Math.Vector4}
     */
    normalized : function()
    {
        var len = this.length();
        var x = this.x / len;
        var y = this.y / len;
        var z = this.z / len;
        var w = this.w / len;

        return new Pixel.Core.Math.Vector4(x, y, z, w);
    },


    /**
     * Returns the length of the vector.
     */
    length : function()
    {
        return Math.sqrt(this.x*this.x + this.y*this.y + this.z*this.z + this.w*this.w);
    },


    /**
     * Returns the squared length of the vector.
     * @returns {string}
     */
    lengthSqrt : function()
    {
        return this.x*this.x + this.y*this.y + this.z*this.z + this.w*this.w;
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
         var w = this.w;

         x += vector.x;
         y += vector.y;
         z += vector.z;
         w += vector.w;

         return new Pixel.Core.Math.Vector4(x,y,z, w);
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
         var w = this.w;

         x -= vector.x;
         y -= vector.y;
         z -= vector.z;
         w -= vector.w;

         return new Pixel.Core.Math.Vector4(x,y,z, w);
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
        var w = this.w;

        x *= value;
        y *= value;
        z *= value;
        w *= value;

        return new Pixel.Core.Math.Vector4(x,y,z, w);
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
        var w = this.w;

        x /= value;
        y /= value;
        z /= value;
        w /= value;

        return new Pixel.Core.Math.Vector4(x,y,z, w);
    },


    /**
     * Returns a string that contains the components of the vector.
     * @returns {string}
     */
    toString : function()
    {
        return "(" + this.x + ", " + this.y + ", " + this.z + "," + this.w + ")";
    }
};


