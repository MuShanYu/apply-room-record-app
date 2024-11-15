export function getUserId() {
  if (!uni.getStorageSync('userInfo')) {
    return null;
  }
  return uni.getStorageSync('userInfo').id
}

export function getToken() {
  if (!uni.getStorageSync('token')) {
    return null;
  }
  return uni.getStorageSync('token')
}