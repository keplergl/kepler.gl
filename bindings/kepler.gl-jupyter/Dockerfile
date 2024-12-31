# NOTE: PLEASE run `yarn build` before running this dockerfile
FROM ubuntu:latest

# Install python3
RUN apt-get update && apt-get install -y python3 python3-pip python3-venv

# Install gdal
RUN apt-get install -y gdal-bin

# Fix: No such file or directory: 'gdal-config'
RUN apt-get install -y libgdal-dev

# Make the current directory the working directory
WORKDIR /kepler.gl

# The current directory is <Root>/bindings/kepler.gl-jupyter
# Copy the root directory contents into the working directory
COPY . .

# Create a virtual environment .venv
RUN python3 -m venv .venv

# Activate the virtual environment
RUN . .venv/bin/activate

# Install jupyter_packaging using pip
RUN .venv/bin/pip install jupyter_packaging


# Install keplergl-jupyter in the virtual environment from the current directory
RUN .venv/bin/pip install .

# Run jupyter notebook with token exposed in logs
CMD [".venv/bin/jupyter", "notebook", "--ip=0.0.0.0", "--port=8888", "--no-browser", "--allow-root", "--NotebookApp.log_level='INFO'"]

EXPOSE 8888
