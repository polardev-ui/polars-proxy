self.__uv$config = {
    prefix: '/uv/service/',
    bare: 'https://wisp-js-7nvq.onrender.com/bare/', 
    wisp: 'wss://wisp-js-7nvq.onrender.com/wisp/',
    encodeUrl: Ultraviolet.codec.xor.encode,
    decodeUrl: Ultraviolet.codec.xor.decode,
    handler: '/uv/uv.handler.js',
    bundle: '/uv/uv.bundle.js',
    config: '/uv/uv.config.js',
    sw: '/uv/uv.sw.js',
};
