exports.smartTrim = (str, length, deliminator, appendix) => {

    if (str.length <= length) return str;
    let trimedStr = str.substr(0, length + deliminator.length);
    let lastDelimIndex = trimedStr.lastIndexOf(deliminator);
    if (lastDelimIndex >= 0) trimedStr = trimedStr.substr(0, lastDelimIndex);
    if (trimedStr) trimedStr += appendix;
    return trimedStr;

};