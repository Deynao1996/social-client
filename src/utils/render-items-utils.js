import { ListItemLink } from '../components/NavigationUI/DesktopNav'
import { getFullName } from './string-transforms-utils'

export function renderFriendLinks(friends, renderActions) {
  return friends?.map((friend) => {
    const fullName = getFullName(friend.lastName, friend.name)
    return (
      <ListItemLink
        key={friend._id}
        to={`/profile/${friend._id}`}
        primary={fullName}
        avatar={friend.profilePicture}
        isOnline={friend.isOnline}
        sx={{ fontWeight: '500' }}
        renderActions={() => renderActions?.(friend._id)}
      />
    )
  })
}
