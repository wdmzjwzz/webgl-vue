import { DataType } from ".";
import { UniformSettersMap } from "./UniformSettersMap";

function floatAttribSetter(gl: WebGL2RenderingContext, index: number) {
  return function (b: any) {
    gl.bindBuffer(gl.ARRAY_BUFFER, b.buffer);
    gl.enableVertexAttribArray(index);
    gl.vertexAttribPointer(
      index,
      b.numComponents || b.size,
      b.type || gl.FLOAT,
      b.normalize || false,
      b.stride || 0,
      b.offset || 0
    );
    if (b.divisor !== undefined) {
      gl.vertexAttribDivisor(index, b.divisor);
    }
  };
}

function intAttribSetter(gl: WebGL2RenderingContext, index: number) {
  return function (b: any) {
    gl.bindBuffer(gl.ARRAY_BUFFER, b.buffer);
    gl.enableVertexAttribArray(index);
    gl.vertexAttribIPointer(
      index,
      b.numComponents || b.size,
      b.type || gl.INT,
      b.stride || 0,
      b.offset || 0
    );
    if (b.divisor !== undefined) {
      gl.vertexAttribDivisor(index, b.divisor);
    }
  };
}

function uintAttribSetter(gl: WebGL2RenderingContext, index: number) {
  return (b: any) => {
    gl.bindBuffer(gl.ARRAY_BUFFER, b.buffer);
    gl.enableVertexAttribArray(index);
    gl.vertexAttribIPointer(
      index,
      b.numComponents || b.size,
      b.type || gl.UNSIGNED_INT,
      b.stride || 0,
      b.offset || 0
    );
    if (b.divisor !== undefined) {
      gl.vertexAttribDivisor(index, b.divisor);
    }
  };
}

function matAttribSetter(
  gl: WebGL2RenderingContext,
  index: number,
  typeInfo: any
) {
  const defaultSize = typeInfo.size;
  const count = typeInfo.count;

  return function (b: any) {
    gl.bindBuffer(gl.ARRAY_BUFFER, b.buffer);
    const numComponents = b.size || b.numComponents || defaultSize;
    const size = numComponents / count;
    const type: number = b.type || gl.FLOAT;
    const typeInfo = (UniformSettersMap as any)[type];
    const stride = typeInfo.size * numComponents;
    const normalize = b.normalize || false;
    const offset = b.offset || 0;
    const rowOffset = stride / count;
    for (let i = 0; i < count; ++i) {
      gl.enableVertexAttribArray(index + i);
      gl.vertexAttribPointer(
        index + i,
        size,
        type,
        normalize,
        stride,
        offset + rowOffset * i
      );
      if (b.divisor !== undefined) {
        gl.vertexAttribDivisor(index + i, b.divisor);
      }
    }
  };
}

export const AttrSetterMap: {
  [key: number]: any;
} = {
  [DataType.FLOAT]: { size: 4, setter: floatAttribSetter },
  [DataType.FLOAT_VEC2]: { size: 8, setter: floatAttribSetter },
  [DataType.FLOAT_VEC3]: { size: 12, setter: floatAttribSetter },
  [DataType.FLOAT_VEC4]: { size: 16, setter: floatAttribSetter },
  [DataType.INT]: { size: 4, setter: intAttribSetter },
  [DataType.INT_VEC2]: { size: 8, setter: intAttribSetter },
  [DataType.INT_VEC3]: { size: 12, setter: intAttribSetter },
  [DataType.INT_VEC4]: { size: 16, setter: intAttribSetter },
  [DataType.UNSIGNED_INT]: { size: 4, setter: uintAttribSetter },
  [DataType.UNSIGNED_INT_VEC2]: { size: 8, setter: uintAttribSetter },
  [DataType.UNSIGNED_INT_VEC3]: { size: 12, setter: uintAttribSetter },
  [DataType.UNSIGNED_INT_VEC4]: { size: 16, setter: uintAttribSetter },
  [DataType.BOOL]: { size: 4, setter: intAttribSetter },
  [DataType.BOOL_VEC2]: { size: 8, setter: intAttribSetter },
  [DataType.BOOL_VEC3]: { size: 12, setter: intAttribSetter },
  [DataType.BOOL_VEC4]: { size: 16, setter: intAttribSetter },
  [DataType.FLOAT_MAT2]: { size: 4, setter: matAttribSetter, count: 2 },
  [DataType.FLOAT_MAT3]: { size: 9, setter: matAttribSetter, count: 3 },
  [DataType.FLOAT_MAT4]: { size: 16, setter: matAttribSetter, count: 4 },
};
