/**
 * 用于设置静态资源路径
 * @param url 静态资源路径
 */
export const getImageUrl = (url: string) => {
  const path = new URL(`../assets/img/icon/${url}`, import.meta.url);
  return path.href;
}