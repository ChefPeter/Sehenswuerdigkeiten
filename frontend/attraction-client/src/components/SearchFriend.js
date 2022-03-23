import SearchIcon from '@mui/icons-material/Search';
import { Typography, Button } from '@mui/material';
import react from 'react';
import { Grid } from '@mui/material';
import LinkIcon from '@mui/icons-material/Search'

function SearchFriend (){

    return (
    
        
            <Grid container direction="row" alignItems="center">
            <Grid item>
              <SearchIcon />
            </Grid>
            <Grid item>
              Suche einen Freund!
            </Grid>
          </Grid>
       
    )

}

export default SearchFriend;