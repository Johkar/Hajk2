import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { withSnackbar } from "notistack";
import Fab from "@material-ui/core/Fab";
import NavigationIcon from "@material-ui/icons/Navigation";
import Grid from "@material-ui/core/Grid";
import TableOfContents from "./TableOfContents";
import clsx from "clsx";
import Contents from "./Contents";
import { Typography } from "@material-ui/core";

const styles = (theme) => ({
  gridContainer: {
    maxHeight: "100%",
    overflowY: "auto",
    overflowX: "hidden",
    userSelect: "text",
    outline: "none",
  },
  contentContainer: {
    paddingBottom: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  margin: {
    marginTop: theme.spacing(2),
  },
  scrollToTopButton: {
    position: "fixed",
    bottom: theme.spacing(2),
    right: theme.spacing(3),
  },
  toc: {
    marginBottom: theme.spacing(2),
  },
  printButton: {
    paddingBottom: theme.spacing(1),
  },
});

class DocumentViewer extends React.PureComponent {
  state = {
    showScrollButton: false,
    showPrintWindow: false,
  };

  constructor(props) {
    super(props);
    this.scrollElementRef = React.createRef();
    this.setScrollButtonLimit();
    this.bindSubscriptions();
  }

  setScrollButtonLimit = () => {
    const { options } = this.props;
    let showScrollButtonLimit = options.showScrollButtonLimit;
    this.scrollLimit =
      showScrollButtonLimit != null && showScrollButtonLimit !== ""
        ? showScrollButtonLimit
        : 400;
  };

  bindSubscriptions = () => {
    const { localObserver } = this.props;

    localObserver.subscribe("scroll-to-chapter", (chapter) => {
      chapter.scrollRef.current.scrollIntoView();
    });

    localObserver.subscribe("scroll-to-top", () => {
      this.scrollToTop();
    });
  };

  onScroll = (e) => {
    if (e.target.scrollTop > this.scrollLimit) {
      this.setState({
        showScrollButton: true,
      });
    } else {
      this.setState({
        showScrollButton: false,
      });
    }
  };

  componentDidUpdate = (prevProps) => {
    if (prevProps.activeDocument !== this.props.activeDocument) {
      this.scrollToTop();
    }
  };

  scrollToTop = () => {
    this.scrollElementRef.current.scrollTop = 0;
  };

  renderScrollToTopButton = () => {
    const { classes } = this.props;
    return (
      <Fab
        className={classes.scrollToTopButton}
        size="small"
        color="primary"
        onClick={this.scrollToTop}
      >
        <Typography variant="srOnly">
          Scrolla till toppen av dokumentet
        </Typography>
        <NavigationIcon />
      </Fab>
    );
  };

  selectAllText = () => {
    let range = document.createRange();
    range.selectNode(this.scrollElementRef.current);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
  };

  render() {
    const {
      classes,
      activeDocument,
      localObserver,
      documentWindowMaximized,
      model,
      options,
      documentColor,
    } = this.props;

    const showTableOfContents =
      activeDocument?.tableOfContents?.active !== undefined
        ? activeDocument.tableOfContents.active
        : true;

    const { showScrollButton } = this.state;
    return (
      <>
        <Grid
          tabIndex="0" //Focus grid to be able to use onKeyDown
          onKeyDown={(e) => {
            //If ctrl-a or command-a is pressed
            if ((e.ctrlKey || e.metaKey) && e.keyCode === 65) {
              this.selectAllText();
              e.preventDefault();
            }
          }}
          onScroll={this.onScroll}
          ref={this.scrollElementRef}
          className={classes.gridContainer}
          container
        >
          {showTableOfContents && (
            <Grid className={classes.toc} xs={12} item>
              <TableOfContents
                documentColor={documentColor}
                localObserver={localObserver}
                activeDocument={activeDocument}
                expanded={options.tableOfContent.expanded}
                title={options.tableOfContent.title}
                chapterLevelsToShow={options.tableOfContent.chapterLevelsToShow}
              />
            </Grid>
          )}

          <Grid
            className={clsx(
              showTableOfContents
                ? classes.contentContainer
                : [classes.contentContainer, classes.margin]
            )}
            container
            item
          >
            <Contents
              options={options}
              model={model}
              localObserver={localObserver}
              activeDocument={activeDocument}
            />
          </Grid>
        </Grid>
        {showScrollButton &&
          documentWindowMaximized &&
          this.renderScrollToTopButton()}
      </>
    );
  }
}

export default withStyles(styles)(withSnackbar(DocumentViewer));
