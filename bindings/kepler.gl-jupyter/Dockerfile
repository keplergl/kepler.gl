# Usage:
# - run `yarn build` (or `build_in_docker.sh`) in `js` directory
# - build a docker image based on this file (`docker build -t jupyterlab-kepler`)
# - run a docker container based on this image (`docker run --rm -t --publish 8888:8888` jupyterlab-kepler`)
FROM ubuntu:latest

# Install dependencies
RUN apt-get update && apt-get install -y \
  python3 python3-pip python3-venv \
  gdal-bin libgdal-dev

# Make the current directory the working directory
WORKDIR /kepler.gl

# The current directory is <Root>/bindings/kepler.gl-jupyter
# Copy the root directory contents into the working directory
COPY . .

# Create a virtual environment in .venv
# Note: you need to re-enable this in every RUN step.
RUN python3 -m venv .venv

# Install jupyter_packaging using pip
RUN . .venv/bin/activate && pip install jupyter_packaging

# Install keplergl-jupyter in the virtual environment from the current directory
RUN . .venv/bin/activate && pip install .

# Run jupyter notebook with token exposed in logs
CMD [".venv/bin/jupyter", "notebook", "--ip=0.0.0.0", "--port=8888", "--no-browser", "--allow-root", "--NotebookApp.log_level='INFO'"]

EXPOSE 8888
