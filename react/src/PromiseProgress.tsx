import { LinearProgress } from "@mui/material";
import React from "react";
import { ProgressivePromise } from "@progressive-promise/core";

// function LinearProgressWithLabel(props: LinearProgressProps & { value: number }) {
//     return (
//         <Box display="flex" alignItems="center">
//             <Box width="100%" mr={1}>
//                 <LinearProgress variant="determinate" {...props} />
//             </Box>
//             <Box minWidth={35}>
//                 <Typography variant="body2" color="textSecondary">{`${Math.round(props.value)}%`}</Typography>
//             </Box>
//         </Box>
//     );
// }

export interface PromiseProgressProps {
    promise: ProgressivePromise;
}

export class PromiseProgress extends React.PureComponent<PromiseProgressProps> {
    onProgress = (progress, message) => {
        this.setState({ progress, message });
    };

    componentDidMount() {
        const { props } = this;
        props.promise.onProgress(this.onProgress);
    }

    componentWillUnmount() {
        const { props } = this;
        props.promise.removeProgressListener(this.onProgress);
    }

    render() {
        const { props } = this;
        return (
            <>
                {props.promise.message}
                <LinearProgress
                    variant={props.promise.progress ? "determinate" : "indeterminate"}
                    style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}
                    value={props.promise.progress * 100}
                />
            </>
        );
    }
}
