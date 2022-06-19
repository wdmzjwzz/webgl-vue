import { DataType } from "."
export interface DataTypeInfo {
    [key: number]: any
}
export const formatInfo: DataTypeInfo = {
    [DataType.ALPHA]: { numColorComponents: 1, },
    [DataType.LUMINANCE]: { numColorComponents: 1, },
    [DataType.LUMINANCE_ALPHA]: { numColorComponents: 2, },
    [DataType.RGB]: { numColorComponents: 3, },
    [DataType.RGBA]: { numColorComponents: 4, },
    [DataType.RED]: { numColorComponents: 1, },
    [DataType.RED_INTEGER]: { numColorComponents: 1, },
    [DataType.RG]: { numColorComponents: 2, },
    [DataType.RG_INTEGER]: { numColorComponents: 2, },
    [DataType.RGB]: { numColorComponents: 3, },
    [DataType.RGB_INTEGER]: { numColorComponents: 3, },
    [DataType.RGBA]: { numColorComponents: 4, },
    [DataType.RGBA_INTEGER]: { numColorComponents: 4, },
    [DataType.DEPTH_COMPONENT]: { numColorComponents: 1, },
    [DataType.DEPTH_STENCIL]: { numColorComponents: 2, },
}

const t: DataTypeInfo = {
    // unsized formats
    [DataType.ALPHA]: {
        textureFormat: DataType.ALPHA,
        colorRenderable: true,
        textureFilterable: true,
        bytesPerElement: [1, 2, 2, 4],
        type: [DataType.UNSIGNED_BYTE, DataType.HALF_FLOAT, DataType.HALF_FLOAT_OES, DataType.FLOAT]
    },
    [DataType.LUMINANCE]: {
        textureFormat: DataType.LUMINANCE,
        colorRenderable: true,
        textureFilterable: true,
        bytesPerElement: [1, 2, 2, 4],
        type: [DataType.UNSIGNED_BYTE, DataType.HALF_FLOAT, DataType.HALF_FLOAT_OES, DataType.FLOAT]
    },
    [DataType.LUMINANCE_ALPHA]: {
        textureFormat: DataType.LUMINANCE_ALPHA,
        colorRenderable: true,
        textureFilterable: true,
        bytesPerElement: [2, 4, 4, 8],
        type: [DataType.UNSIGNED_BYTE, DataType.HALF_FLOAT, DataType.HALF_FLOAT_OES, DataType.FLOAT]
    },
    [DataType.RGB]: { textureFormat: DataType.RGB, colorRenderable: true, textureFilterable: true, bytesPerElement: [3, 6, 6, 12, 2], type: [DataType.UNSIGNED_BYTE, DataType.HALF_FLOAT, DataType.HALF_FLOAT_OES, DataType.FLOAT, DataType.UNSIGNED_SHORT_5_6_5], },
    [DataType.RGBA]: { textureFormat: DataType.RGBA, colorRenderable: true, textureFilterable: true, bytesPerElement: [4, 8, 8, 16, 2, 2], type: [DataType.UNSIGNED_BYTE, DataType.HALF_FLOAT, DataType.HALF_FLOAT_OES, DataType.FLOAT, DataType.UNSIGNED_SHORT_4_4_4_4, DataType.UNSIGNED_SHORT_5_5_5_1], },
    [DataType.DEPTH_COMPONENT]: { textureFormat: DataType.DEPTH_COMPONENT, colorRenderable: true, textureFilterable: false, bytesPerElement: [2, 4], type: [DataType.UNSIGNED_INT, DataType.UNSIGNED_SHORT], },

    // sized formats
    [DataType.R8]: { textureFormat: DataType.RED, colorRenderable: true, textureFilterable: true, bytesPerElement: [1], type: [DataType.UNSIGNED_BYTE], },
    [DataType.R8_SNORM]: { textureFormat: DataType.RED, colorRenderable: false, textureFilterable: true, bytesPerElement: [1], type: [DataType.BYTE], },
    [DataType.R16F]: { textureFormat: DataType.RED, colorRenderable: false, textureFilterable: true, bytesPerElement: [4, 2], type: [DataType.FLOAT, DataType.HALF_FLOAT], },
    [DataType.R32F]: { textureFormat: DataType.RED, colorRenderable: false, textureFilterable: false, bytesPerElement: [4], type: [DataType.FLOAT], },
    [DataType.R8UI]: { textureFormat: DataType.RED_INTEGER, colorRenderable: true, textureFilterable: false, bytesPerElement: [1], type: [DataType.UNSIGNED_BYTE], },
    [DataType.R8I]: { textureFormat: DataType.RED_INTEGER, colorRenderable: true, textureFilterable: false, bytesPerElement: [1], type: [DataType.BYTE], },
    [DataType.R16UI]: { textureFormat: DataType.RED_INTEGER, colorRenderable: true, textureFilterable: false, bytesPerElement: [2], type: [DataType.UNSIGNED_SHORT], },
    [DataType.R16I]: { textureFormat: DataType.RED_INTEGER, colorRenderable: true, textureFilterable: false, bytesPerElement: [2], type: [DataType.SHORT], },
    [DataType.R32UI]: { textureFormat: DataType.RED_INTEGER, colorRenderable: true, textureFilterable: false, bytesPerElement: [4], type: [DataType.UNSIGNED_INT], },
    [DataType.R32I]: { textureFormat: DataType.RED_INTEGER, colorRenderable: true, textureFilterable: false, bytesPerElement: [4], type: [DataType.INT], },
    [DataType.RG8]: { textureFormat: DataType.RG, colorRenderable: true, textureFilterable: true, bytesPerElement: [2], type: [DataType.UNSIGNED_BYTE], },
    [DataType.RG8_SNORM]: { textureFormat: DataType.RG, colorRenderable: false, textureFilterable: true, bytesPerElement: [2], type: [DataType.BYTE], },
    [DataType.RG16F]: { textureFormat: DataType.RG, colorRenderable: false, textureFilterable: true, bytesPerElement: [8, 4], type: [DataType.FLOAT, DataType.HALF_FLOAT], },
    [DataType.RG32F]: { textureFormat: DataType.RG, colorRenderable: false, textureFilterable: false, bytesPerElement: [8], type: [DataType.FLOAT], },
    [DataType.RG8UI]: { textureFormat: DataType.RG_INTEGER, colorRenderable: true, textureFilterable: false, bytesPerElement: [2], type: [DataType.UNSIGNED_BYTE], },
    [DataType.RG8I]: { textureFormat: DataType.RG_INTEGER, colorRenderable: true, textureFilterable: false, bytesPerElement: [2], type: [DataType.BYTE], },
    [DataType.RG16UI]: { textureFormat: DataType.RG_INTEGER, colorRenderable: true, textureFilterable: false, bytesPerElement: [4], type: [DataType.UNSIGNED_SHORT], },
    [DataType.RG16I]: { textureFormat: DataType.RG_INTEGER, colorRenderable: true, textureFilterable: false, bytesPerElement: [4], type: [DataType.SHORT], },
    [DataType.RG32UI]: { textureFormat: DataType.RG_INTEGER, colorRenderable: true, textureFilterable: false, bytesPerElement: [8], type: [DataType.UNSIGNED_INT], },
    [DataType.RG32I]: { textureFormat: DataType.RG_INTEGER, colorRenderable: true, textureFilterable: false, bytesPerElement: [8], type: [DataType.INT], },
    [DataType.RGB8]: { textureFormat: DataType.RGB, colorRenderable: true, textureFilterable: true, bytesPerElement: [3], type: [DataType.UNSIGNED_BYTE], },
    [DataType.SRGB8]: { textureFormat: DataType.RGB, colorRenderable: false, textureFilterable: true, bytesPerElement: [3], type: [DataType.UNSIGNED_BYTE], },
    [DataType.RGB565]: { textureFormat: DataType.RGB, colorRenderable: true, textureFilterable: true, bytesPerElement: [3, 2], type: [DataType.UNSIGNED_BYTE, DataType.UNSIGNED_SHORT_5_6_5], },
    [DataType.RGB8_SNORM]: { textureFormat: DataType.RGB, colorRenderable: false, textureFilterable: true, bytesPerElement: [3], type: [DataType.BYTE], },
    [DataType.R11F_G11F_B10F]: { textureFormat: DataType.RGB, colorRenderable: false, textureFilterable: true, bytesPerElement: [12, 6, 4], type: [DataType.FLOAT, DataType.HALF_FLOAT, DataType.UNSIGNED_INT_10F_11F_11F_REV], },
    [DataType.RGB9_E5]: { textureFormat: DataType.RGB, colorRenderable: false, textureFilterable: true, bytesPerElement: [12, 6, 4], type: [DataType.FLOAT, DataType.HALF_FLOAT, DataType.UNSIGNED_INT_5_9_9_9_REV], },
    [DataType.RGB16F]: { textureFormat: DataType.RGB, colorRenderable: false, textureFilterable: true, bytesPerElement: [12, 6], type: [DataType.FLOAT, DataType.HALF_FLOAT], },
    [DataType.RGB32F]: { textureFormat: DataType.RGB, colorRenderable: false, textureFilterable: false, bytesPerElement: [12], type: [DataType.FLOAT], },
    [DataType.RGB8UI]: { textureFormat: DataType.RGB_INTEGER, colorRenderable: false, textureFilterable: false, bytesPerElement: [3], type: [DataType.UNSIGNED_BYTE], },
    [DataType.RGB8I]: { textureFormat: DataType.RGB_INTEGER, colorRenderable: false, textureFilterable: false, bytesPerElement: [3], type: [DataType.BYTE], },
    [DataType.RGB16UI]: { textureFormat: DataType.RGB_INTEGER, colorRenderable: false, textureFilterable: false, bytesPerElement: [6], type: [DataType.UNSIGNED_SHORT], },
    [DataType.RGB16I]: { textureFormat: DataType.RGB_INTEGER, colorRenderable: false, textureFilterable: false, bytesPerElement: [6], type: [DataType.SHORT], },
    [DataType.RGB32UI]: { textureFormat: DataType.RGB_INTEGER, colorRenderable: false, textureFilterable: false, bytesPerElement: [12], type: [DataType.UNSIGNED_INT], },
    [DataType.RGB32I]: { textureFormat: DataType.RGB_INTEGER, colorRenderable: false, textureFilterable: false, bytesPerElement: [12], type: [DataType.INT], },
    [DataType.RGBA8]: { textureFormat: DataType.RGBA, colorRenderable: true, textureFilterable: true, bytesPerElement: [4], type: [DataType.UNSIGNED_BYTE], },
    [DataType.SRGB8_ALPHA8]: { textureFormat: DataType.RGBA, colorRenderable: true, textureFilterable: true, bytesPerElement: [4], type: [DataType.UNSIGNED_BYTE], },
    [DataType.RGBA8_SNORM]: { textureFormat: DataType.RGBA, colorRenderable: false, textureFilterable: true, bytesPerElement: [4], type: [DataType.BYTE], },
    [DataType.RGB5_A1]: { textureFormat: DataType.RGBA, colorRenderable: true, textureFilterable: true, bytesPerElement: [4, 2, 4], type: [DataType.UNSIGNED_BYTE, DataType.UNSIGNED_SHORT_5_5_5_1, DataType.UNSIGNED_INT_2_10_10_10_REV], },
    [DataType.RGBA4]: { textureFormat: DataType.RGBA, colorRenderable: true, textureFilterable: true, bytesPerElement: [4, 2], type: [DataType.UNSIGNED_BYTE, DataType.UNSIGNED_SHORT_4_4_4_4], },
    [DataType.RGB10_A2]: { textureFormat: DataType.RGBA, colorRenderable: true, textureFilterable: true, bytesPerElement: [4], type: [DataType.UNSIGNED_INT_2_10_10_10_REV], },
    [DataType.RGBA16F]: { textureFormat: DataType.RGBA, colorRenderable: false, textureFilterable: true, bytesPerElement: [16, 8], type: [DataType.FLOAT, DataType.HALF_FLOAT], },
    [DataType.RGBA32F]: { textureFormat: DataType.RGBA, colorRenderable: false, textureFilterable: false, bytesPerElement: [16], type: [DataType.FLOAT], },
    [DataType.RGBA8UI]: { textureFormat: DataType.RGBA_INTEGER, colorRenderable: true, textureFilterable: false, bytesPerElement: [4], type: [DataType.UNSIGNED_BYTE], },
    [DataType.RGBA8I]: { textureFormat: DataType.RGBA_INTEGER, colorRenderable: true, textureFilterable: false, bytesPerElement: [4], type: [DataType.BYTE], },
    [DataType.RGB10_A2UI]: { textureFormat: DataType.RGBA_INTEGER, colorRenderable: true, textureFilterable: false, bytesPerElement: [4], type: [DataType.UNSIGNED_INT_2_10_10_10_REV], },
    [DataType.RGBA16UI]: { textureFormat: DataType.RGBA_INTEGER, colorRenderable: true, textureFilterable: false, bytesPerElement: [8], type: [DataType.UNSIGNED_SHORT], },
    [DataType.RGBA16I]: { textureFormat: DataType.RGBA_INTEGER, colorRenderable: true, textureFilterable: false, bytesPerElement: [8], type: [DataType.SHORT], },
    [DataType.RGBA32I]: { textureFormat: DataType.RGBA_INTEGER, colorRenderable: true, textureFilterable: false, bytesPerElement: [16], type: [DataType.INT], },
    [DataType.RGBA32UI]: { textureFormat: DataType.RGBA_INTEGER, colorRenderable: true, textureFilterable: false, bytesPerElement: [16], type: [DataType.UNSIGNED_INT], },
    // Sized Internal
    [DataType.DEPTH_COMPONENT16]: { textureFormat: DataType.DEPTH_COMPONENT, colorRenderable: true, textureFilterable: false, bytesPerElement: [2, 4], type: [DataType.UNSIGNED_SHORT, DataType.UNSIGNED_INT], },
    [DataType.DEPTH_COMPONENT24]: { textureFormat: DataType.DEPTH_COMPONENT, colorRenderable: true, textureFilterable: false, bytesPerElement: [4], type: [DataType.UNSIGNED_INT], },
    [DataType.DEPTH_COMPONENT32F]: { textureFormat: DataType.DEPTH_COMPONENT, colorRenderable: true, textureFilterable: false, bytesPerElement: [4], type: [DataType.FLOAT], },
    [DataType.DEPTH24_STENCIL8]: { textureFormat: DataType.DEPTH_STENCIL, colorRenderable: true, textureFilterable: false, bytesPerElement: [4], type: [DataType.UNSIGNED_INT_24_8], },
    [DataType.DEPTH32F_STENCIL8]: { textureFormat: DataType.DEPTH_STENCIL, colorRenderable: true, textureFilterable: false, bytesPerElement: [4], type: [DataType.FLOAT_32_UNSIGNED_INT_24_8_REV], },
};
Object.keys(t).forEach((internalFormat: any) => {
    const info = t[internalFormat];
    info.bytesPerElementMap = {};
    info.bytesPerElement.forEach((bytesPerElement: number, ndx: number) => {
        const type = info.type[ndx];
        info.bytesPerElementMap[type] = bytesPerElement;
    });
});
export function getTextureInternalFormatInfo(internalFormat: number) { 
    return t[internalFormat];
}
