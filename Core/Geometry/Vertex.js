/**
 * Represents a vertex in three dimensional space. The Vertex is defined by position, normal and color.
 *
 * @author Julian Kratt
 */


Pixel.Core.Geometry.Vertex = function(x, y, z)
{
    if(Pixel.Core.Geometry.Vertex .arguments.length == 3)
    {
        this.vx = x;
        this.vy = y;
        this.vz = z;
        this.vw = 1.0;
    }
    else
    {
        this.vx = 0.0;
        this.vy = 0.0;
        this.vz = 0.0;
        this.vw = 1.0;
    }

    this.nx = 0.0;
    this.ny = 0.0;
    this.nz = 0.0;
    this.nw = 1.0;

    this.cx = 1.0;
    this.cy = 1.0;
    this.cz = 1.0;
    this.cw = 1.0;

    this.tx = 0.0;
    this.ty = 0.0;
    this.tz = 0.0;
    this.tw = 1.0;
 }

// Shortcut
Pixel.Vertex = Pixel.Core.Geometry.Vertex;
Vertex = Pixel.Core.Geometry.Vertex;

Pixel.Core.Geometry.Vertex.prototype = {

    array : function()
    {
        var rs = new Array();
        rs.push(this.vx);
        rs.push(this.vy);
        rs.push(this.vz);
        rs.push(this.vw);

        rs.push(this.nx);
        rs.push(this.ny);
        rs.push(this.nz);
        rs.push(this.nw);

        rs.push(this.cx);
        rs.push(this.cy);
        rs.push(this.cz);
        rs.push(this.cw);

        rs.push(this.tx);
        rs.push(this.ty);
        rs.push(this.tz);
        rs.push(this.tw);

        return rs;
    }

}
