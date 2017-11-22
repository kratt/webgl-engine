precision highp float;

const float math_pi = 3.1415926536;
const float math_radians = math_pi / 180.0;


uniform float window_width;
uniform float window_height;
uniform mat4 matCamView;
uniform mat4 matCamRot;
uniform mat4 matCamZoom;

uniform mat4 matCamRotX;
uniform mat4 matCamRotY;	

uniform float t;
uniform float Speed;
uniform float Modifier;
uniform float Iterations;
uniform int isAnimated;
uniform float curAnimationTime;


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
	
	int maxIter = int(Iterations);
	
	for (int i=1; i<=5; ++i) 
	{
		if( i > int(Iterations)) break;
		float xa = mod(3.0*x*p, 3.0);
		float ya = mod(3.0*y*p, 3.0);
		float za = mod(3.0*z*p, 3.0);
		
		//p*=3.0;
		p *= float(int(Modifier));

		float xx = 0.5-abs(xa - 1.5);
		float yy = 0.5-abs(ya - 1.5); 
		float zz = 0.5-abs(za - 1.5);
		
		d1 = min(max(xx, zz), min(max(xx, yy), max(yy, zz))) / p; //distance inside the 3 axis-aligned square tubes

		d = max(d, d1); //intersection
	}

	return d;
}

float mengerspongeRepetition(vec3 p, vec3 rep)
{
	vec3 q = mod(p, rep) - 0.5*rep;
	q.y = p.y;
	
    return mengersponge_de(q);
}

float udRoundBox( vec3 p, vec3 dims, float r )
{
  return length(max(abs(p) - dims, 0.0)) - r;
}

float sdBox( vec3 p, vec3 dims )
{
  vec3 d = abs(p) - dims;
  return min(max(d.x,max(dims.y, dims.z)),0.0) + length(max(d,0.0));
}

float sdBoxRepetition(vec3 p, vec3 dims, vec3 rep)
{
	vec3 q = mod(p, rep) - 0.5*rep;
	q.y = p.y;
	
    return udRoundBox ( q, dims, 0.2);
}

float sdSphere(vec3 p, float s)
{
	return length(p) - s;
}

float sdTorus( vec3 p, vec2 t )
{
  vec2 q = vec2(length(p.xz)-t.x,p.y);
  return length(q)-t.y;
}

// ground plane
float sdPlane(vec3 p, vec4 n )
{
  // n must be normalized
  return dot(p,n.xyz) + n.w;
}

vec3 opTwist( vec3 p ); 

float distanceField(in vec3 p)
{
	p = opTwist(p);
	
	float sphere = sdSphere(p, 0.8);
	float sponge = mengersponge_de(p); 
	
	float diff = max(sphere, sponge);
	
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
	
	float alpha = sin(curAnimationTime*2.0*PI)*p.y;

    float c = cos(alpha);
    float s = sin(alpha);
    mat2  m = mat2(c, -s, s,  c);
	
	vec2 tmp = m * p.xz;
	vec3 q = vec3(tmp.x, p.y, tmp.y);

    return q;
}

vec3 calcNormal(in vec3 pos)
{
    vec3  eps = vec3(0.001,0.0,0.0);
	
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
	
	float aspect = float(window_width)/float(window_height);
	
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
	screen_x = window_width  - screen_x;
	
	screen_x -= window_width  / 2.0;
	screen_y -= window_height / 2.0;

	// scale screen coordinates so that half the view port width and height becomes 1
	screen_y /= (window_height / 2.0);
	screen_x /= (window_width / 2.0);

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

void main()
{
	vec3 ray_dir;
	vec3 ray_orig;
	
	GetRay(ray_orig, ray_dir); 
		
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
			
			vec3 finalColor = vec3(val, val, val)*ao*1.5;
			
			
			gl_FragColor = vec4(finalColor, 1.0);
			break;
		}
		else if(delta > 10000.0)
		{
			gl_FragColor = vec4(0.95, 0.95, 0.95, 1.0);
				gl_FragColor = vec4(1.0);
			break;
		}
	}
	
}









