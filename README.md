## Shader Assembly Language

A simple assembly language that is executed inside of a shader, programs created with this assembly language are executed as fragment shaders running once per pixel across an entire screen, allows for modification of shaders without recompiling them.

## Specifications:
### Basics
Every program written in Shader Assembly will be executed for each and every pixel of the image, it will be made up of instructions that operate on the provided inputs and update the needed outputs.

### Types
* Scaler: A 32 bit IEEE.754 floating point number
* Vector: Always has four components
* Integer: An integer

### Registers
* s0 -> s5: Scaler registers
* v0 -> v4: Vector registers

| Number | Name | Type | Use |
|:---:|:---:|:---:|:---:|
| 00 | z | Scaler | Returns zero |
| 01 | s0 | Scaler | - |
| 02 | s1 | Scaler | - |
| 03 | s2 | Scaler | - |
| 04 | s3 | Scaler | - |
| 05 | s4 | Scaler | - |
| 06 | s5 | Vector | - |
| 07 | v0 | Vector | - |
| 08 | v1 | Vector | - |
| 09 | v2 | Vector | - |
| 10 | v3 | Vector | - |
| 11 | v4 | Vector | - |
| 12 | pc | Vector | Pixel coordinate |
| 13 | t | Scaler | Time |
| 14 | s | Vector | Size of screen in pixels |
| 15 | c | Vector | Output color |

### Memory
In addition to registers, each program has access to 64 scalers of memory accessible with the readMemory and writeMemory instructions

### Instructions
There must be at most one instruction per line
#### Types:
### Three Register (3R)
Take in three registers, typically applies an operation using the first two and returns the output in the third register

| | OpCode | R1 | R2 | R3 | - |
|---|---|---|---|---|---|
| Bits | 4 | 4 | 4 | 4 | 16 |

### Two Register (2R)
Take in two registers, typically applies an operation to the first and stores the result in the second

| | OpCode | R1 | R2 | - |
|---|---|---|---|---|
| Bits | 4 | 4 | 4 | 20 |

### Register Scaler (RS)
Takes in one register and one hardcoded scaler

| | OpCode | R1 | Scaler
|---|---|---|---|
| Bits | 4 | 4 | 24 | 

| Opcode | Type | Instruction | Action |
|:---:|:---:|---|---|
| 00 | 3R | add(sA, sB, sC) | Adds sA and sB placing the result in sC |
| 01 | 3R | multiply(sA, sB, sC) | Multiples sA and sB placing the result in sC |
| 02 | 2R | negate(sA, sB) | Negates the value in sA and stores the result in sB |
| 03 | 2R | reciprocal(sA, sB) | Takes the reciprocal of the value in sA and stores the result in sB |
| 04 | 2R | move(sA, sB) | Copies the value stored in sA into sB |
| 05 | 3R | getComponent(vA, sA, sB) | Gets the floor(sB)'th component of vA and places it inside of sA |
| 06 | 3R | setComponent(vA, sA, sB) | Sets the floor(sB)'th of vA to the value of sA |
| 07 | RS | load(sA, Integer) | Converts Integer to a floating point number (ie: 42 -> 42.0f or 24 -> 24.0f), and assigns sA to that value. |
| 08 | R2 | readMemory(sA, sA) | Reads the floor(sB)'th value in memory into sA |
| 09 | R2 | writeMemory(sA, sB) | Writes the value in sA into the floor(sB)'th value in memory |
| 10 | 2R | sign(sA, sB) | Determines the sign of sA and stores the result in sB (either 1.0, 0.0, or -1.0) |

### Inputs
Values stored in special registers that can be used throughout shader execution
* pc (Vector): The 0th and 1st components store the pixel coordinate of the running program
* t (Scaler): The time since the start of the program in seconds
* s (Vector): The 0th and 1st components store the maximum size in pixels of the current screen

### Outputs
Special registers that are read from by the backing program in order to show the shader output
* c (Vector): The desired final pixel color, is 0.0 in all components by default

### Comments
Whenever a hashtag (#) is found, all characters including it to the end of the line will be ignored

## Example Programs
### Pixel UV Color
Assign each pixels red component to be based on its x coordinate where pixels on the far left are black and on the far right are red, and assign the green component based on the pixels y coordinate so that pixels on the bottom are white and pixels at the top are green.

To see the creation process of this shader checkout: `ShaderAssembly/SphereIntersect.asm`

```
getComponent(pc, s0, z)   # s0 = pc.x
load(s5, 1)               # s5 = 1
getComponent(pc, s1, s5) # s1 = pc.y

getComponent(s, s3, z)    # s3 = s.x
reciprocal(s3, s2)        # s2 = 1 / s3
getComponent(s, s4, s5)   # s4 = s.y
reciprocal(s4, s3)        # s3 = 1 / s4

multiply(s0, s2, s0)      # s0 = s0 * s2
multiply(s1, s3, s1)      # s1 = s1 * s3

setComponent(c, s0, z)    # c.x = s0
setComponent(c, s1, s5)   # c.y = s1
```

### Ray Sphere Intersector
Draws a white sphere of radius 1.0 at at position (0.0, 0.0, -2.0)

```
# Compute uv, store it in v0
getComponent(pc, s0, z)		# s0 = pc.x
load(s5, 1)					# s5 = 1.0
getComponent(pc, s1, s5)	# s1 = pc.y
setComponent(v0, s0, z)		# v0.x = s0
load(s2, 1)					# s2 = 1.0
setComponent(v0, s1, s2)	# v0.y = s1
load(s2, 2)					# s2 = 2.0
setComponent(v0, z, s2)		# v0.z = z
load(s2, 3)					# s2 = 3.0
setComponent(v0, z, s2)		# v0.w = z

getComponent(s, s0, z)		# s0 = s.x
load(s5, 1)					# s5 = 1.0
getComponent(s, s1, s5)		# s1 = s.y
reciprocal(s0, s0)			# s0 = 1.0 / s0
reciprocal(s1, s1)			# s1 = 1.0 / s1

getComponent(v0, s2, z)		# s2 = v0.x
load(s5, 1)					# s5 = 1.0
getComponent(v0, s3, s5)	# s3 = v0.y
multiply(s2, s0, s0)		# s0 = s2 * s0
multiply(s3, s1, s1)		# s1 = s3 * s1
setComponent(v0, s0, z)		# v0.x = s0
load(s5, 1)					# s5 = 1.0
setComponent(v0, s1, s5)	# v0.y = s1

# Adjust the uv to center around the origin
# Multiply by 2.0
getComponent(v0, s0, z)		# s0 = v0.x
load(s5, 1)					# s5 = 1.0
getComponent(v0, s1, s5)	# s1 = v0.y
load(s2, 2)					# s2 = 2.0
multiply(s0, s2, s3)		# s3 = s0 * s2
multiply(s1, s2, s4)		# s4 = s1 * s2
setComponent(v0, s3, z)		# v0.x = s3
load(s5, 1)					# s5 = 1.0
setComponent(v0, s4, s5)	# v0.y = s4
	
## Subtract 1.0
getComponent(v0, s0, z)		# s0 = v0.x
load(s5, 1)					# s5 = 1.0
getComponent(v0, s1, s5)	# s1 = v0.y
load(s2, 1)					# s2 = 1.0
negate(s2, s2)				# s2 = -s2
add(s0, s2, s0)				# s0 = s0 + s2
add(s1, s2, s1)				# s1 = s1 + s2
setComponent(v0, s0, z)		# v0.x = s0
load(s5, 1)					# s5 = 1.0
setComponent(v0, s1, s5)	# v0.y = s1

# Adjust for aspect ratio
load(s5, 1)					# s5 = 1.0
getComponent(s, s0, s5)		# s0 = s.y
reciprocal(s0, s0)			# s0 = 1.0 / s0
getComponent(s, s1, z)		# s1 = s.x
multiply(s1, s0, s0)		# s0 = s1 * s0
getComponent(v0, s1, z)		# s1 = v0.x
multiply(s1, s0, s0)		# s0 = s1 * s0
setComponent(v0, s0, z)		# v0.x = s0

# Initialize the ray direction, reuse the uv as the ray direction
load(s5, 2)					# s5 = 2.0
load(s4, 1)					# s4 = 1.0
negate(s4, s4)				# s4 = -s4
setComponent(v0, s4, s5)	# v0.z = s4
load(s5, 3)					# s5 = 3.0
setComponent(v0, z, s5)		# v0.w = 0.0
	
# Define sphere, s0 is the z coordinate
load(s0, 2)					# s0 = 2.0
negate(s0, s0)				# s0 = -s0

# Compute a (from quadratic formula), stored in s1
getComponent(v0, s1, z)		# s1 = v0.x
multiply(s1, s1, s1)		# s1 = s1 * s1
load(s5, 1)					# s5 = 1.0
getComponent(v0, s2, s5)	# s2 = v0.y
multiply(s2, s2, s2)		# s2 = s2 * s2
load(s5, 2)					# s5 = 2.0
getComponent(v0, s3, s5)	# s3 = v0.z
multiply(s3, s3, s3)		# s3 = s3 * s3
add(s1, s2, s1)				# s1 = s1 + s2
add(s1, s3, s1)				# s1 = s1 + s3
	
# Compute b (from quadratic formula), stored in s2
load(s2, 2)					# s2 = 2.0
negate(s2, s2)				# s2 = -s2
load(s5, 2)					# s5 = 2.0
getComponent(v0, s3, s5)	# s3 = v0.z
multiply(s2, s3, s2)		# s2 = s2 * s3
multiply(s2, s0, s2)		# s2 = s2 * s0

# Compute c (from quadratic formula), stored in s3
load(s3, 1)					# s3 = 1.0
negate(s3, s3)				# s3 = -s3
multiply(s0, s0, s4)		# s4 = s0 * s0
add(s4, s3, s3)				# s3 = s4 + s3

# Compute discriminant, store in s0
multiply(s2, s2, s4)		# s4 = s2 * s2
load(s5, 4)					# s5 = 4.0
multiply(s5, s1, s5)		# s5 = s5 * s1
multiply(s5, s3, s5)		# s5 = s5 * s3
negate(s5, s5)				# s5 = -s5
add(s4, s5, s0)				# s0 = s4 + s5

# Using: max(a, b) = 0.5 * (a + b + |a - b|)

# Clamp discriminant first time
# Set s1 = max(s0, 0.0)
sign(s0, s1)				# s1 = sign(s0)
multiply(s1, s0, s1)		# s1 = s1 * s0
add(s1, s0, s1)				# s1 = s1 + s0
load(s2, 2)					# s2 = 2.0
reciprocal(s2, s2)			# s2 = 1.0 / 2.0
multiply(s2, s1, s1)		# s1 = s2 * s1

# Set s2 = min(s1, 1.0) = -max(-s1, -1.0)
load(s4, 1)					# s4 = 1.0
negate(s1, s1)				# s1 = -s1
add(s4, s1, s3)				# s3 = s4 + s1
sign(s3, s2)				# s2 = sign(s3)
multiply(s2, s3, s2)		# s2 = s2 * s3
negate(s4, s4)				# s4 = -s4
add(s4, s2, s3)				# s3 = s4 + s2
add(s3, s1, s3)				# s3 = s3 + s1
move(s3, s0)				# s0 = s3
negate(s0, s0)				# s0 = -s0
load(s1, 2)					# s1 = 2.0
reciprocal(s1, s1)			# s1 = 1.0 / s1
multiply(s0, s1, s0)		# s0 = s0 * s1

# Take all values greater then 0, and ensure they are greater then 1
load(s1, 100)				# s1 = 100.0
multiply(s0, s1, s0)		# s0 = s0 * s1

# Clamp discriminant second time
# Set s1 = max(s0, 0.0)
sign(s0, s1)				# s1 = sign(s0)
multiply(s1, s0, s1)		# s1 = s1 * s0
add(s1, s0, s1)				# s1 = s1 + s0
load(s2, 2)					# s2 = 2.0
reciprocal(s2, s2)			# s2 = 1.0 / 2.0
multiply(s2, s1, s1)		# s1 = s2 * s1

# Set s2 = min(s1, 1.0) = -max(-s1, -1.0)
load(s4, 1)					# s4 = 1.0
negate(s1, s1)				# s1 = -s1
add(s4, s1, s3)				# s3 = s4 + s1
sign(s3, s2)				# s2 = sign(s3)
multiply(s2, s3, s2)		# s2 = s2 * s3
negate(s4, s4)				# s4 = -s4
add(s4, s2, s3)				# s3 = s4 + s2
add(s3, s1, s3)				# s3 = s3 + s1
move(s3, s0)				# s0 = s3
negate(s0, s0)				# s0 = -s0
load(s1, 2)					# s1 = 2.0
reciprocal(s1, s1)			# s1 = 1.0 / s1
multiply(s0, s1, s0)		# s0 = s0 * s1

load(s1, 1)					# s1 = 1.0
load(s2, 2)					# s2 = 2.0
load(s3, 3)					# s3 = 3.0

setComponent(c, s0, z)		# c.x = s0
setComponent(c, s0, s1)		# c.y = s0
setComponent(c, s0, s2)		# c.y = s0
setComponent(c, s1, s3)		# c.y = s1
```