import SearchIcon from '@mui/icons-material/Search';
import { Grid } from '@mui/material';

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