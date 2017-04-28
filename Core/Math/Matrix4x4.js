/**
 * @class Squared four dimensional matrix.
 *
 * @author Julian Kratt
 */


Pixel.Core.Math.Matrix4x4 = function()
{
    this.m11 = 0; this.m12 = 0; this.m13 = 0; this.m14 = 0;
    this.m21 = 0; this.m22 = 0; this.m23 = 0; this.m24 = 0;
    this.m31 = 0; this.m32 = 0; this.m33 = 0; this.m34 = 0;
    this.m41 = 0; this.m42 = 0; this.m43 = 0; this.m44 = 0;

    return this;
};

// shortcut
Pixel.mat4 = Pixel.Core.Math.Matrix4x4;
mat4 = Pixel.Core.Math.Matrix4x4;


Pixel.Core.Math.Matrix4x4.prototype = {

    /**
     * Sets the values of the matrix.
     * @param m11
     * @param m12
     * @param m13
     * @param m14
     * @param m21
     * @param m22
     * @param m23
     * @param m24
     * @param m31
     * @param m32
     * @param m33
     * @param m34
     * @param m41
     * @param m42
     * @param m43
     * @param m44
     * @returns {*}
     */
    set: function(m11,m12,m13,m14,
                  m21,m22,m23,m24,
                  m31,m32,m33,m34,
                  m41,m42,m43,m44  )
    {

        this.m11 = m11; this.m12 = m12; this.m13 = m13; this.m14 = m14;
        this.m21 = m21; this.m22 = m22; this.m23 = m23; this.m24 = m24;
        this.m31 = m31; this.m32 = m32; this.m33 = m33; this.m34 = m34;
        this.m41 = m41; this.m42 = m42; this.m43 = m43; this.m44 = m44;

        return this;
    },

    /**
     * Sets a matrix to the identity matrix.
     */
    setToIdentity : function()
    {
        return this.set(
            1,0,0,0,
            0,1,0,0,
            0,0,1,0,
            0,0,0,1
        );
    },


    /**
     * Sets all component of the matrix to zero.
     */
    setToZero: function() {
        return this.set(
            0,0,0,0,
            0,0,0,0,
            0,0,0,0,
            0,0,0,0
        );
    },


    /**
     * Returns the transposed matrix.
     * @returns {*}
     */
    transposed : function()
    {
        var mat = new Pixel.Core.Math.Matrix4x4();

        mat.set(
            this.m11, this.m21, this.m31, this.m41,
            this.m12, this.m22, this.m32, this.m42,
            this.m13, this.m23, this.m33, this.m43,
            this.m14, this.m24, this.m34, this.m44
        );

        return mat;
    },


    /**
     * Builds up a rotation matrix.
     * @param angle Angle in degree.
     * @param n Axis of rotation.
     * @returns {*}
     */
    rotate : function(angle, n)
    {
        var math_radians = Math.PI / 180.0;
        n.normalize();

        var c = Math.cos(angle * math_radians);
        var ac = 1.0 - c;
        var s = Math.sin(angle * math_radians);

        var m11 = n.x * n.x * ac + c;
        var m12 = n.x * n.y * ac + n.z * s;
        var m13 = n.x * n.z * ac - n.y * s;

        var m21 = n.y * n.x * ac - n.z * s;
        var m22 = n.y * n.y * ac + c;
        var m23 = n.y * n.z * ac + n.x * s;

        var m31 = n.z * n.x * ac + n.y * s;
        var m32 = n.z * n.y * ac - n.x * s;
        var m33 = n.z * n.z * ac + c;

        return this.set(
            m11, m12, m13, 0.0,
            m21, m22, m23, 0.0,
            m31, m32, m33, 0.0,
            0.0, 0.0, 0.0, 1.0);
    },


    /**
     * Rotation around the x axis.
     * @param angle  Angle in degree.
     */
    rotateX : function(angle)
    {
        var n = new Pixel.Core.Math.Vector3(1.0, 0.0, 0.0);
        return this.rotate(angle, n);
    },

    /**
     * Rotation around the y axis.
     * @param angle  Angle in degree.
     */
    rotateY : function(angle)
    {
        var n = new Pixel.Core.Math.Vector3(0.0, 1.0, 0.0);
        return this.rotate(angle, n);
    },

    /**
     * Rotation around the z axis.
     * @param angle  Angle in degree.
     */
    rotateZ : function(angle)
    {
        var n = new Pixel.Core.Math.Vector3(0.0, 0.0, 1.0);
        return this.rotate(angle, n);
    },


    /**
     * Scale matrix.
     * @param x Scale in x direction.
     * @param y Scale in y direction.
     * @param z Scale in z direction.
     * @returns {*}
     */
    scale : function(x, y, z)
    {
        return this.set(
            x, 0, 0, 0,
            0, y, 0, 0,
            0, 0, z, 0,
            0, 0, 0, 1);
    },


    /**
     * Scale matrix.
     * @param vector Scaling vector.
     * @returns {*}
     */
    scaleByVector : function(vector)
    {
        return this.scale(vector.x, vector.y, vector.z);
    },

    /**
     * Translation matrix.
     * @param x  Translation in x direction.
     * @param y  Translation in y direction.
     * @param z  Translation in z direction.
     * @returns {*}
     */
    translate : function(x, y, z)
    {
        return this.set(
            1, 0, 0, x,
            0, 1, 0, y,
            0, 0, 1, z,
            0, 0, 0, 1);
    } ,


    /**
     * Translation matrix.
     * @param vector Translation vector.
     */
    translateByVector : function(vector)
    {
        return this.translate(vector.x, vector.y, vector.z);
    },


    /**
     * Orthographic projection matrix.
     * @param left
     * @param right
     * @param bottom
     * @param top
     * @param zNear
     * @param zFar
     * @returns {*}
     */
    orthographic : function(left, right, bottom, top, zNear, zFar)
    {
        var x = - (right + left) / (right - left);
        var y = - (top + bottom) / (top - bottom);
        var z = - (zFar + zNear) / (zFar - zNear);

        var a =  2 / (right - left);
        var b =  2 / (top - bottom);
        var c = -2 / (zFar - zNear);

         return this.set(
             a, 0, 0, x,
             0, b, 0, y,
             0, 0, c, z,
             0, 0, 0, 1);
    },


    /**
     * Perspective projection matrix.
     * @param fov
     * @param aspect
     * @param zNear
     * @param zFar
     * @returns {*}
     */
    perspective : function(fov, aspect, zNear, zFar)
    {
        var math_radians = Math.PI / 180.0;

        var f = 1.0 / Math.tan(fov * math_radians / 2.0);
        var a = (zFar + zNear) / (zNear - zFar);
        var b = (2.0 * zFar * zNear) / (zNear - zFar);
        var c = f / aspect;

        return this.set(
            c, 0, 0, 0,
            0, f, 0, 0,
            0, 0, a, b,
            0, 0, -1, 0);
    },

    /**
     * Returns the projection matrix defined by "Look-at".
     * @param position
     * @param center
     * @param up
     * @returns {*}
     */
    lookAt : function(position, center, up)
    {
        var f = position.subtract(center).normalize();
        var s = up.cross(f).normalize();
        var u = f.cross(s).normalize();

        var d =  -s.dot(position);

        return this.set(
            s.x, s.y, s.z, -s.dot(position),
            u.x, u.y, u.z, -u.dot(position),
            f.x, f.y, f.z, -f.dot(position),
            0, 0, 0, 1);
    },

    /**
     * Multiplication with another matrix.
     * @param mat Matrix
     * @returns {*}
     */
    multiply : function(mat)
    {
        var c = new mat4().setToIdentity();

        c.m11 = this.m11*mat.m11 + this.m12*mat.m21 + this.m13*mat.m31 + this.m14*mat.m41;
        c.m12 = this.m11*mat.m12 + this.m12*mat.m22 + this.m13*mat.m32 + this.m14*mat.m42;
        c.m13 = this.m11*mat.m13 + this.m12*mat.m23 + this.m13*mat.m33 + this.m14*mat.m43;
        c.m14 = this.m11*mat.m14 + this.m12*mat.m24 + this.m13*mat.m34 + this.m14*mat.m44;

        c.m21 = this.m21*mat.m11 + this.m22*mat.m21 + this.m23*mat.m31 + this.m24*mat.m41;
        c.m22 = this.m21*mat.m12 + this.m22*mat.m22 + this.m23*mat.m32 + this.m24*mat.m42;
        c.m23 = this.m21*mat.m13 + this.m22*mat.m23 + this.m23*mat.m33 + this.m24*mat.m43;
        c.m24 = this.m21*mat.m14 + this.m22*mat.m24 + this.m23*mat.m34 + this.m24*mat.m44;

        c.m31 = this.m31*mat.m11 + this.m32*mat.m21 + this.m33*mat.m31 + this.m34*mat.m41;
        c.m32 = this.m31*mat.m12 + this.m32*mat.m22 + this.m33*mat.m32 + this.m34*mat.m42;
        c.m33 = this.m31*mat.m13 + this.m32*mat.m23 + this.m33*mat.m33 + this.m34*mat.m43;
        c.m34 = this.m31*mat.m14 + this.m32*mat.m24 + this.m33*mat.m34 + this.m34*mat.m44;

        c.m41 = this.m41*mat.m11 + this.m42*mat.m21 + this.m43*mat.m31 + this.m44*mat.m41;
        c.m42 = this.m41*mat.m12 + this.m42*mat.m22 + this.m43*mat.m32 + this.m44*mat.m42;
        c.m43 = this.m41*mat.m13 + this.m42*mat.m23 + this.m43*mat.m33 + this.m44*mat.m43;
        c.m44 = this.m41*mat.m14 + this.m42*mat.m24 + this.m43*mat.m34 + this.m44*mat.m44;

        return c;
    },


    /**
     * Returns a string with the components of the matrix.
     */
    toString : function()
    {
        return "(" + this.m11+","+this.m12+","+this.m13+","+this.m14+")\n"+
        "(" + this.m21+","+this.m22+","+this.m23+","+this.m24+")\n"+
        "(" + this.m31+","+this.m32+","+this.m33+","+this.m34+")\n"+
        "(" + this.m41+","+this.m42+","+this.m43+","+this.m44+")\n";
    },

    /**
     * Returns the matrix as array.
     * @returns {Array}
     */
    toArray : function()
    {
        var m = new Array();

        m.push(this.m11);
        m.push(this.m21);
        m.push(this.m31);
        m.push(this.m41);

        m.push(this.m12);
        m.push(this.m22);
        m.push(this.m32);
        m.push(this.m42);

        m.push(this.m13);
        m.push(this.m23);
        m.push(this.m33);
        m.push(this.m43);

        m.push(this.m14);
        m.push(this.m24);
        m.push(this.m34);
        m.push(this.m44);

        return m;
    }
};




