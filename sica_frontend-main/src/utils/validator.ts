export const validator = (name: String,value : any, rulesMap: any, notify: any) =>{
    let isValid = true;
    let n = 0;
    const rules = resolve(rulesMap,name)
    if (rules){
        while (isValid && n < rules.length){
            const res : any = rules[n](value);
            if (res !== true){
                notify(res,"error");
                isValid = false;
            }
            n++;
        }
    }
    return isValid;
}

const resolve = (obj: object, path: String) =>{
    const pathMapped : Array<any> = path.split('.');
    var current: any = obj;
    while (path.length){
        current = current[pathMapped.shift()];
    }
    return current;
}