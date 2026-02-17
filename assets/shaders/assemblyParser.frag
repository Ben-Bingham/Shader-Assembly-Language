#version 430 core

out vec4 outFragColor;

in vec2 uv;

uniform vec3 color;

uniform vec3 screenSize;

// Registers:
const int reg_z = 0;
const int reg_s0 = 1; 
const int reg_s1 = 2; 
const int reg_s2 = 3; 
const int reg_s3 = 4; 
const int reg_s4 = 5; 
const int reg_s5 = 6; 
const int reg_v0 = 7; 
const int reg_v1 = 8; 
const int reg_v2 = 9; 
const int reg_v3 = 10; 
const int reg_v4 = 11; 
const int reg_pc = 12; 
const int reg_t = 13;
const int reg_s = 14;
const int reg_c = 15;

// Op codes:
const int inst_add = 0;
const int inst_multiply = 1;
const int inst_negate = 2;
const int inst_reciprocal = 3;
const int inst_move = 4;
const int inst_getComponent = 5;
const int inst_setComponent = 6;
const int inst_load = 7;
const int inst_readMemory = 8;
const int inst_writeMemory = 9;

int GetOpCode(uint instruction) {
	return int(instruction >> 28);
}

int GetFirstRegister(uint instruction) {
	uint r1 = instruction << 4;

	return int(r1 >> 28);
}

int GetSecondRegister(uint instruction) {
	uint r2 = instruction << 8;

	return int(r2 >> 28);
}

int GetThirdRegister(uint instruction) {
	uint r3 = instruction << 12;

	return int(r3 >> 28);
}

float GetConstant(uint instruction) {
	uint constant = instruction << 8;

	constant = constant >> 8;

	return float(constant);
}

uniform int instructionCount;
layout(std430, binding = 0) readonly buffer InstructionsSSBO {
    uint instructions[];
};

vec4 registers[16];

void ExecuteInstruction(uint instruction, inout vec4 registers[16]);

float memory[64];

// TODO convert everything to uint
void main() {
	// Prepare registers
	registers[reg_z] = vec4(0.0); // Zero out the zero register
	registers[reg_c] = vec4(0.0); // Zero out the color register

	registers[reg_pc] = vec4(uv.x * screenSize.x, uv.y * screenSize.y, 0.0, 0.0);
	registers[reg_s] = vec4(screenSize.x, screenSize.y, 0.0, 0.0);
	// TODO time register

	// Execute the instruction list
	for (int i = 0; i < instructionCount; ++i) {
		ExecuteInstruction(instructions[i], registers);
	}

	outFragColor = registers[reg_c]; // Assign the final color to the color register
}

// TODO modifying read only registers
void ExecuteInstruction(uint instruction, inout vec4 registers[16]) {
	int opcode = GetOpCode(instruction);

	int r1 = GetFirstRegister(instruction);
	int r2 = GetSecondRegister(instruction);
	int r3 = GetThirdRegister(instruction);
	float constant = GetConstant(instruction);

	switch (opcode) {
		case inst_add:
			registers[r3].x = registers[r1].x + registers[r2].x;
			break;

		case inst_multiply:
			registers[r3].x = registers[r1].x * registers[r2].x;
			break;

		case inst_negate:
			registers[r2].x = -registers[r1].x;
			break;

		case inst_reciprocal:
			registers[r2].x = 1.0 / registers[r1].x;
			break;

		case inst_move:
			registers[r2].x = registers[r1].x;
			break;

		case inst_getComponent:
			float v1 = registers[r3].x;
			int offset1 = int(floor(v1));
			registers[r2].x = registers[r1][offset1];
			break;

		case inst_setComponent:
			float v2 = registers[r3].x;
			int offset2 = int(floor(v2));
			registers[r1][offset2] = registers[r2].x;
			break;
		
		case inst_load:
			registers[r1].x = int(constant);
			break;

		case inst_readMemory:
			float v3 = registers[r2].x;
			int offset3 = int(floor(v3));
			registers[r1].x = memory[offset3];
			break;
			
		case inst_writeMemory:
			float v4 = registers[r2].x;
			int offset4 = int(floor(v4));
			memory[offset4] = registers[r1].x;
			break;
	}
}
