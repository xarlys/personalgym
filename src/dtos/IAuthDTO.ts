
export type IUserAuthDTO = {
  id: string
  name: string
  email: string
  avatar: string
}

export type IUserTokenDTO = {
  user_who_created_id: string,
  token: string,
  expires_in_token: string,
  expires_in_refresh_token: string,
}
