precision highp float;

varying vec4 vPosition; 
varying vec4 vNormal; 
varying vec4 vColor; 
varying vec4 vTexture; 

varying vec3 vEyeVec;
varying vec3 vLightVec;

uniform sampler2D texKd;
uniform sampler2D texKs;

uniform bool hasTexKs;

uniform float Ns;
vec3 lightColor = vec3(1.0, 1.0, 1.0);

void main() 
{    
   vec2 uv = vec2(vTexture.x, 1.0-vTexture.y);
   vec3 texColor = texture2D(texKd, uv).xyz;
     
   vec3 N = normalize(vNormal.xyz);
   vec3 V = normalize(vEyeVec);
   vec3 L = normalize(vLightVec);
   vec3 H = normalize(L + V);

   float d = max(0.3, dot(N, L));
   float s = pow(max(dot(N, H), 0.0), Ns);

   vec3 diffuse = texColor * d;
   vec3 specular;
   
   if(hasTexKs)
   {
	   vec3 texSpecular = texture2D(texKs, vec2(vTexture.x, 1.0-vTexture.y)).xyz;
	   specular *= texSpecular;
   }
   else{
	  specular = lightColor  * s * 0.1;
   }

   vec3 color = diffuse + specular;
   
   gl_FragColor = vec4(color, 1.0);
}