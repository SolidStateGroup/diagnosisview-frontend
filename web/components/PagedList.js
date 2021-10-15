import React from 'react';
import { Component } from 'react';

class TheComponent extends Component<ComponentType> {
    state = {}

    render() {
        const chunks = _.chunk(this.props.data, this.props.pageSize || 6)
        const page = this.props.page || 0;
        const data = chunks[page]
        return (

            <div className="paged-list">
            <div className={this.props.containerClassName}>
                {this.props.header}
                {
                    data && data.map(this.props.renderItem)
                }
            </div>

                <div className="paged-list__paging">
                    <div className="row">
                        <div className="col-xl-8 col-lg-12">
                            <Row className="justify-content-center">
                                {chunks.map((v,i)=>(
                                    <a key={i} onClick={()=>this.props.onPageChange(i)} className={"button button--page button--rounded mr-2 " + (i === page ? " button--primary": " ")}>
                                        {i+1}
                                    </a>
                                ))}
                            </Row>
                        </div>
                    </div>
                </div>

        </div>
        )
    }
}

export default TheComponent
