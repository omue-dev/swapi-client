// utils.ts
export const sanitizeDescription = (data: string): string => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = data;
    tempDiv.querySelectorAll('[id], [class]').forEach(el => {
      el.removeAttribute('id');
      el.removeAttribute('class');
    });
    tempDiv.querySelectorAll('span').forEach(el => {
      while (el.firstChild) el.parentNode?.insertBefore(el.firstChild, el);
      el.parentNode?.removeChild(el);
    });
    return tempDiv.innerHTML;
  };
  