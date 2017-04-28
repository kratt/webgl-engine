/**
 * Frustum
 * @author Julian Kratt
 */

Pixel.Core.Renderer.Frustum = function()
{
    this.ntl = new Vector3();
    this.ntr = new Vector3();
    this.nbl = new Vector3();
    this.nbr = new Vector3();
    this.ftl = new Vector3();
    this.ftr = new Vector3();
    this.fbl = new Vector3();
    this.fbr = new Vector3();

    this.nearD = 0.0;
    this.farD  = 0.0;
    this.ratio = 0.0;
    this.ang   = 0.0;
    this.tang  = 0.0;

    this.nw = 0.0;
    this.nh = 0.0;
    this.fw = 0.0;
    this.fh = 0.0;
};


// Shortcut
Pixel.Frustum = Pixel.Core.Renderer.Frustum;

Pixel.Core.Renderer.Frustum.prototype = {

    setCamInternals : function(ang, ratio, nearD, farD)
    {
        this.ratio = ratio;
        this.ang   = ang;
        this.nearD = nearD;
        this.farD  = farD;

        var math_radians = Math.PI / 180.0;
        var tang = Math.tan(this.ang * math_radians * 0.5);

        this.nh = this.nearD * tang;
        this.nw = this.nh * this.ratio;

        this.fh = this.farD  * tang;
        this.fw = this.fh * this.ratio;
    },

    setCamDef : function(p, l, u)
    {
        var dir = new Vector3();
        var nc  = new Vector3();
        var fc  = new Vector3();
        var X   = new Vector3();
        var Y   = new Vector3();
        var Z   = new Vector3();

        Z = p.add(l.subtract(p));
        Z.normalize();

        X = cross(u, Z);
        X.normalize();


        Y = cross(Z, X);

        nc = p.subtract(Z.multiply(this.nearD));
        fc = p.subtract(Z.multiply(this.farD));

        this.ntl = nc.add(Y.multiply(this.nh).subtract(X.multiply(this.nw)));
        this.ntr = nc.add(Y.multiply(this.nh).add(X.multiply(this.nw)));
        this.nbl = nc.subtract(Y.multiply(this.nh).subtract(X.multiply(this.nw)));
        this.nbr = nc.subtract(Y.multiply(this.nh).add(X.multiply(this.nw)));

        this.ftl = fc.add(Y.multiply(this.fh)).subtract(X.multiply(this.fw));
        this.ftr = fc.add(Y.multiply(this.fh)).add(X.multiply(this.fw));
        this.fbl = fc.subtract(Y.multiply(this.fh)).subtract(X.multiply(this.fw));
        this.fbr = fc.subtract(Y.multiply(this.fh)).add(X.multiply(this.fw));
    }
}

/*
vec3 dir, nc, fc, X, Y, Z;

Z = p + (l-p);
Z.normalize();

X = cross(u, Z);
X.normalize();

Y = cross(Z, X);

nc = p - Z * nearD;
fc = p - Z * farD;

ntl = nc + Y * nh - X * nw;
ntr = nc + Y * nh + X * nw;
nbl = nc - Y * nh - X * nw;
nbr = nc - Y * nh + X * nw;

ftl = fc + Y * fh - X * fw;
ftr = fc + Y * fh + X * fw;
fbl = fc - Y * fh - X * fw;
fbr = fc - Y * fh + X * fw;

pl[TOP].set3Points(ntr, ntl, ftl);
pl[BOTTOM].set3Points(nbl, nbr, fbr);
pl[LEFT].set3Points(ntl, nbl, fbl);
pl[RIGHT].set3Points(nbr, ntr, fbr);
pl[NEARP].set3Points(ntl, ntr, nbr);
pl[FARP].set3Points(ftr, ftl, fbl);
 */

































