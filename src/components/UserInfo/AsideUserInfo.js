import { FamilyRestroom, Flag, LocationCity } from '@mui/icons-material'
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader
} from '@mui/material'
import React from 'react'
import GridUserFriendsList from '../Lists/GridUserFriendsList'

const AsideUserInfo = ({ data, renderActionButton }) => {
  function setRelationStatus(num) {
    switch (num) {
      case 1:
        return 'Married'
      case 2:
        return 'Actively looking'
      case 3:
        return 'Difficult situation'
      case 0:
        return 'No information yet'
      default:
        return 'No information yet'
    }
  }

  return (
    <>
      {renderActionButton()}
      <List
        dense={true}
        subheader={
          <ListSubheader
            component="div"
            sx={{ fontWeight: 'bold', display: { xs: 'none', md: 'block' } }}
          >
            User information:
          </ListSubheader>
        }
      >
        <ListItem>
          <ListItemIcon>
            <LocationCity />
          </ListItemIcon>
          <ListItemText
            primary="City:"
            secondary={data?.data.city}
            secondaryTypographyProps={{ sx: { textTransform: 'capitalize' } }}
          />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <Flag />
          </ListItemIcon>
          <ListItemText
            primary="From:"
            secondary={data?.data.from}
            secondaryTypographyProps={{ sx: { textTransform: 'capitalize' } }}
          />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <FamilyRestroom />
          </ListItemIcon>
          <ListItemText
            primary="Relationship:"
            secondaryTypographyProps={{ sx: { textTransform: 'capitalize' } }}
            secondary={setRelationStatus(data?.data.relationship)}
          />
        </ListItem>
      </List>
      <GridUserFriendsList following={data?.data.following} />
    </>
  )
}

export default AsideUserInfo
