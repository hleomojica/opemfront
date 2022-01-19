import CryptoJS from 'crypto-js'

export function isPermitted(modulo) {
    const encrMenu = localStorage.getItem('menu');
    if (encrMenu) {
        const decryptedText = CryptoJS.AES.decrypt(encrMenu, "staencripmaschimba").toString(CryptoJS.enc.Utf8)
        const modules = JSON.parse(decryptedText)
     
        for (var d = 0; d < modules.length; d++) {
            var modu = modules[d]                    
            if (modu.nombre_mod.toLowerCase() == modulo.toLowerCase() && modu.roles.length > 0) {              
                if (modu.roles[0].permisosroles && modu.roles[0].permisosroles.ver_prol == 1) {
                    return true
                }
            }
        }
    }
    return false
}

export const PermittedMixin = {
    methods: {
        isPermitted
    }
}