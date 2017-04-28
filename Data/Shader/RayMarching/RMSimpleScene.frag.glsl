precision highp float;

const float math_pi = 3.1415926536;
const float math_radians = math_pi / 180.0;

uniform float t;
uniform float windowWidth;
uniform float windowHeight;
uniform mat4 matCamView;
uniform mat4 matCamRot;
uniform mat4 matCamZoom;

uniform mat4 matCamRotX;
uniform mat4 matCamRotY;	

uniform float modifier;
uniform float numIterations;
uniform float curAnimationTime;

bool isAnimated;


float Fractal(vec3 pos)
{
   const int Iterations = 14;
   const float Scale = 1.85;
   const float Offset = 10.0; // 2.0
   
    vec3 a1 = vec3(1,1,1);
	vec3 a2 = vec3(-1,-1,1);
	vec3 a3 = vec3(1,-1,-1);
	vec3 a4 = vec3(-1,1,-1);
	vec3 c;
	float dist, d;
	for (int n = 0; n < Iterations; n++)
	{
      if(pos.x+pos.y<0.) pos.xy = -pos.yx; // fold 1
      if(pos.x+pos.z<0.) pos.xz = -pos.zx; // fold 2
      if(pos.y+pos.z<0.) pos.zy = -pos.yz; // fold 3	
      pos = pos*Scale - Offset*(Scale-1.0);
	}
	return length(pos) * pow(Scale, -float(Iterations));
}


float mengersponge_de(vec3 pos) 
{ 
	//by recursively digging a box
	float x = pos.x;
	float y = pos.y;
	float z = pos.z;
	
	x = x * 0.5 + 0.5;
	y = y * 0.5 + 0.5;
	z = z * 0.5 + 0.5; 

	float xx = abs(x-0.5)-0.5;
	float yy = abs(y-0.5)-0.5;
	float zz = abs(z-0.5)-0.5;
 
	float d1 = max(xx, max(yy, zz)); //distance to the box
	float d = d1; 
	float p = 1.0;
	
	int maxIter = int(numIterations);
	
	for (int i=1; i<=5; ++i) 
	{
		if( i > int(numIterations)) break;
		float xa = mod(3.0*x*p, 3.0);
		float ya = mod(3.0*y*p, 3.0);
		float za = mod(3.0*z*p, 3.0);
		
		//p*=3.0;
		p *= float(int(modifier));

		float xx = 0.5-abs(xa - 1.5);
		float yy = 0.5-abs(ya - 1.5); 
		float zz = 0.5-abs(za - 1.5);
		
		d1 = min(max(xx, zz), min(max(xx, yy), max(yy, zz))) / p; //distance inside the 3 axis-aligned square tubes

		d = max(d, d1); //intersection
	}

	return d;
}

vec3 opTwist( vec3 p ); 

float distanceField(in vec3 p)
{
	p = opTwist(p);
	
	float sponge = mengersponge_de(p); 
	float sirpinzski = Fractal(p);
		
	return sponge; 
}


float opRep( vec3 p, vec3 c )
{
	vec3 q = mod(p,c)-0.5*c;
    return distanceField( q);
}

vec3 opTwist( vec3 p )
{
	float PI = 3.14159265359;
	
	float alpha = 0.0; // sin(curAnimationTime*2.0*PI)*p.y;
	//float alpha = sin(curAnimationTime * 2.0 * PI)*p.y;
	
    float c = cos(alpha);
    float s = sin(alpha);
    mat2  m = mat2(c, -s, s,  c);
	
	vec2 tmp = m * p.xz;
	vec3 q = vec3(tmp.x, p.y, tmp.y);

    return q;
}

vec3 calcNormal(in vec3 pos)
{
    vec3  eps = vec3(0.01,0.0,0.0);
	
    vec3 n;
    n.x = distanceField(pos+eps.xyy) - distanceField(pos-eps.xyy);
    n.y = distanceField(pos+eps.yxy) - distanceField(pos-eps.yxy);
    n.z = distanceField(pos+eps.yyx) - distanceField(pos-eps.yyx);
	
    return normalize(n);
}

float shadow( in vec3 ro, in vec3 rd )
{
	const int maxShadowSteps = 100;
	
	const float mint = 0.1;
	const float maxt = 50.0;
	float  t = mint;
	
	
	for(int i=0; i<maxShadowSteps; ++i)
	{
		if(t > maxt) break;
		
		float h = distanceField(ro + rd*t);
        if( h<0.001 )
            return 0.0;
        t += h;
	}

	return 1.0;
}

float Softshadow( in vec3 landPoint, in vec3 lightVector, float mint, float maxt, float iterations )
{
    float penumbraFactor = 1.0;
    float t = mint; 
	
    for( int s = 0; s < 100; ++s )
    {
        if(t > maxt) break;
        float nextDist = distanceField(landPoint + lightVector * t );

        if( nextDist < 0.001 ){
            return 0.0;
        }
        //float penuAttenuation = mix (1.0, 0.0, t/maxt);
        penumbraFactor = min( penumbraFactor, iterations * nextDist / t );
        t += nextDist;
    }
    return penumbraFactor;
}

void GetRay(out vec3 ray_orig, out vec3 ray_dir)
{
	vec3 camPos  = ( matCamView * vec4(0.0, 0.0, 0.0, 1.0)).xyz;
	
	vec3 viewDir = -camPos;
	vec3 upDir   = vec3(0.0, 1.0, 0.0);
	
	float fov = 45.0;
	float nearDistance = 0.1;
	
	float aspect = float(windowWidth)/float(windowHeight);
	
	float screen_x = gl_FragCoord.x;
	float screen_y = gl_FragCoord.y;
	

	vec3 view = normalize(viewDir);
	vec3 h = normalize(cross(view, upDir));
	vec3 v = normalize(cross(h, view));

	float rad = fov * math_radians;
	float vLength = tan( rad / 2.0 ) * nearDistance;
	float hLength = vLength * aspect;

	v *= vLength;
	h *= hLength;

	// translate screen coordinates so that the origin lies in the center of the view port
	screen_y = screen_y;
	screen_x = windowWidth  - screen_x;
	
	screen_x -= windowWidth  / 2.0;
	screen_y -= windowHeight / 2.0;

	// scale screen coordinates so that half the view port width and height becomes 1
	screen_y /= (windowHeight / 2.0);
	screen_x /= (windowWidth / 2.0);

	// linear combination to compute intersection of ray with view port plane
	vec3 pos = camPos + view*nearDistance + h*screen_x + v*screen_y;
	vec3 dir = normalize(pos - camPos);

	ray_orig = camPos;
	ray_dir = dir;
}

#define AO_K      1.5
#define AO_DELTA  0.2
#define AO_N      5
float getAO (in vec3 pos, in vec3 nor) 
{
  float sum = 0.0;
  float weight = 0.5;
  float delta = AO_DELTA;
  
  for (int i=0; i<AO_N; ++i) {
    sum += weight * (delta - distanceField(pos+nor*delta));
    
    delta += AO_DELTA;
    weight *= 0.5;
  }
  return clamp(1.0 - AO_K*sum, 0.0, 1.0);
}

float AO(vec3 p, vec3 n)
{
	const int numSamples = 5;
	float ao = 1.0;
	float delta = 0.5;
	
	for(int i=0; i<numSamples; ++i)
	{
		float dist = distanceField(p + n*float(i)*delta);
		float scale = 1.0/pow(2.0, float(i));
		ao -= scale*dist;
	}
	
	return clamp(ao, 0.0, 1.0);
}
#define RAY_DEPTH 256
#define MAX_DEPTH 100.0
#define SHADOW_RAY_DEPTH 32
#define DISTANCE_MIN 0.01

vec4 March(vec3 ro, vec3 rd)
{
   float t = 0.0;
   float d = 1.0;
   for (int i=0; i<1024; i++)
   {
      vec3 p = ro + rd * t;
      d = distanceField(p);
      if (abs(d) < DISTANCE_MIN)
      {
         return vec4(p, 1.0);
      }
      t += d;
      if (t >= MAX_DEPTH) break;
   }
   return vec4(0.0);
}

// Based on original by IQ - optimized to remove a divide
float CalcAO(vec3 p, vec3 n)
{
   float r = 0.0;
   float w = 1.0;
   for (int i=1; i<=5; i++)
   {
      float d0 = float(i) * 0.3;
      r += w * (d0 - distanceField(p + n * d0));
      w *= 0.5;
   }
   return 1.0 - clamp(r,0.0,1.0);
}


vec4 Shading(vec3 pos, vec3 rd, vec3 norm)
{
   vec3 diffuse = vec3(0.8);
   
   vec3 lightDir = vec3(0.0, 1.0, 0.0);
   vec3 lightColor = vec3(1.0);
   vec3 light = lightColor * max(0.0, dot(norm, lightDir));
   vec3 heading = normalize(-rd + lightDir);
   
   light = (diffuse * light);
  // if (shadows) light *= SoftShadow(pos, lightDir, 32.0);
  // if (ao) light += CalcAO(pos, norm) * ambientFactor;
   
   light = vec3(CalcAO(pos, norm)); // * ambientFactor;
   
   return vec4(light, 1.0);
}


void main()
{
	vec3 ray_dir;
	vec3 ray_orig;
	
	GetRay(ray_orig, ray_dir); 
	
	vec4 res = March(ray_orig, ray_dir);
		
	
	if(res.a == 1.0){
		vec3 n = calcNormal(res.xyz);
		float ao = getAO(res.xyz, n);
		
		vec3 col = clamp(Shading(res.xyz, ray_dir, n).xyz, 0.0, 1.0);
		gl_FragColor = vec4(col, 1.0);
	}
	else
		gl_FragColor = vec4(vec3(1.0), 1.0);
	
/*	
	vec3 light = vec3(0.0,0.0,0.0);


	const int maxSteps = 1024;
	float delta  = 0.0;
	
	int numSteps = 0;
	
	for(int i=0; i<maxSteps; ++i)
	{
		float dist = distanceField(ray_orig + delta*ray_dir);
		
		delta += dist;
		
		++numSteps;
		if(abs(dist) < 0.001) 
		{
			vec3 pointOnSurface = ray_orig + delta*ray_dir;
			vec3 n = calcNormal(pointOnSurface);
			
			float shadowVal = Softshadow(pointOnSurface, normalize(light-pointOnSurface), 0.01, 50.0, 7.0);
			//float shadowVal = shadow(pointOnSurface, normalize(light-pointOnSurface));
			
			float DOT = max(0.0, dot(normalize(light), n));
			
			float ao = getAO(pointOnSurface, n);
			float val = 1.0;
			
			vec3 finalColor = vec3(val, val, val)*ao*1.0;
			
			
			gl_FragColor = vec4(finalColor, 1.0);
			break;
		}
		else if(delta > 10000.0)
		{
			gl_FragColor = vec4(1.0);
			break;
		}
	}
	*/
	
}









