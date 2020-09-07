import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import MapIcon from "@material-ui/icons/Map";
import Button from "@material-ui/core/Button";
import cslx from "clsx";
import { ListItem, ListItemText, IconButton } from "@material-ui/core";
import { Table, TableBody, TableRow, TableCell } from "@material-ui/core";

const styles = (theme) => ({
  hidden: {
    display: "none",
  },
});

class SearchResultsDatasetFeature extends React.PureComponent {
  state = {
    showAllInformation: false,
  };

  showDetails = (e) => {
    const { setSelectedFeatureAndSource, feature, source } = this.props;
    const selectedFeatureAndSource = { feature, source };
    setSelectedFeatureAndSource(selectedFeatureAndSource);
  };

  render() {
    const { feature, handleCheckedToggle, classes, source } = this.props;
    const { showAllInformation } = this.state;
    let texts = source.displayFields.map((df) => feature.properties[df]);

    return (
      <ListItem key={feature.id}>
        <Grid container>
          <Grid item xs={6}>
            <ListItemText
              primary={texts.shift()}
              secondary={texts.join(", ")}
            />
          </Grid>
          <Grid item xs={6}>
            <IconButton
              aria-label="show-in-map"
              onClick={handleCheckedToggle(feature.id)}
            >
              <MapIcon />
            </IconButton>
          </Grid>
          <Grid item xs={12}>
            <Table>
              <TableBody>
                {Object.entries(feature.properties).map((row, index) => {
                  if (index >= 2) {
                    return (
                      <TableRow
                        className={cslx(
                          !showAllInformation ? classes.hidden : null
                        )}
                        key={row[0]}
                      >
                        <TableCell>{row[0]}</TableCell>
                        <TableCell align="right">{row[1]}</TableCell>
                      </TableRow>
                    );
                  } else {
                    return (
                      <TableRow key={row[0]}>
                        <TableCell>{row[0]}</TableCell>
                        <TableCell align="right">{row[1]}</TableCell>
                      </TableRow>
                    );
                  }
                })}
              </TableBody>
            </Table>
          </Grid>
          <Grid item xs={12}>
            <Button
              color="primary"
              onClick={() =>
                this.setState({
                  showAllInformation: !this.state.showAllInformation,
                })
              }
            >
              {showAllInformation ? "Visa mindre" : "Visa mer"}
            </Button>
          </Grid>
        </Grid>
      </ListItem>
    );
  }
}
export default withStyles(styles)(SearchResultsDatasetFeature);
