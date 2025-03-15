/**
 * 工具函数封装
 */

export default {
    formateDate(date, rule) {
        let fmt = rule || 'yyyy-MM-dd hh:mm:ss';
        // if(/(y+)/.test(fmt)){
        //     fmt = fmt.replace(RegExp.$1, date.getFullYear());
        const obj = {
            'y+': date.getFullYear(),
            'M+': date.getMonth() + 1,
            'd+': date.getDate(),
            'h+': date.getHours(),
            'm+': date.getMinutes(),
            's+': date.getSeconds()
        }

        // for(let k in obj){
        //     if(new RegExp(`(${k})`).test(fmt)){
        //         const val = obj[k] + '';
        //         fmt.replace(RegExp.$1,val);
        //     }
        // }
        // 遍历每个格式规则（如 'y+', 'M+'）
        for (const k in obj) {
            const val = obj[k];
            // 创建正则表达式，匹配格式中的键（如 'y+'）
            const regex = new RegExp(`(${k})`, 'g');
            // 替换所有匹配项为对应的值
            fmt = fmt.replace(regex, (match) => {
                // 补零处理（如月份 1 → '01'）
                return val.toString().padStart(match.length, '0');
            });
        }
        return fmt;
    }
}