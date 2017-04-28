/**
 * Collection of methods.
 */


function cross(a, b)
{
   if(a instanceof Pixel.Core.Math.Vector3 &&
      b instanceof Pixel.Core.Math.Vector3)
   {
      return a.cross(b);
   }
}
